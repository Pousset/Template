import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { Player } from '../player/entities/player.entity';
import { GameGateway } from '../game/game.gateway';

// Helper functions
function generateToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const PLAYER_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-rose-500',
];

const AVATARS = [
  '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎼',
  '🎹', '🎸', '🎺', '🎻', '🥁', '🎰', '🏆', '🏅', '⚽', '🏀',
  '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏏',
  '⛳', '🎿', '🏹', '🎣', '🥊', '🥋',
];

function getRandomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private gameGateway: GameGateway,
  ) {}

  async createSession(
    masterPseudo: string,
    config: {
      matchDuration: number;
      responseTime: number;
      muteTime: number;
      defaultPoints: number;
    },
    emoji?: string,
    color?: string,
  ) {
    console.log('🎨 createSession called with:', { masterPseudo, emoji, color });
    
    // Generate unique token
    let token = generateToken();
    let exists = await this.sessionRepository.findOne({ where: { token } });
    while (exists) {
      token = generateToken();
      exists = await this.sessionRepository.findOne({ where: { token } });
    }

    // Create session
    const session = this.sessionRepository.create({
      token,
      status: SessionStatus.LOBBY,
      ...config,
      masterId: '', // Will be set after master player creation
    });

    await this.sessionRepository.save(session);

    // Create master player
    const masterPlayer = this.playerRepository.create({
      sessionId: session.id,
      pseudo: masterPseudo,
      isMaster: true,
      isConnected: true,
      avatar: emoji || '👑',
      color: color || 'bg-amber-800',
      score: 0,
    });

    await this.playerRepository.save(masterPlayer);
    
    console.log('👑 ===== MASTER PLAYER SAVED TO DB =====');
    console.log('👑 Avatar:', masterPlayer.avatar, '| Color:', masterPlayer.color);
    console.log('👑 ======================================');

    // Update session with masterId
    session.masterId = masterPlayer.id;
    await this.sessionRepository.save(session);

    return {
      session: {
        id: session.id,
        token: session.token,
        status: session.status,
        config: {
          matchDuration: session.matchDuration,
          responseTime: session.responseTime,
          muteTime: session.muteTime,
          defaultPoints: session.defaultPoints,
        },
        masterId: session.masterId,
        currentRound: session.currentRound,
        isRoundActive: session.isRoundActive,
        currentRoundPoints: session.currentRoundPoints,
        rematchVotes: session.rematchVotes || [],
        createdAt: session.createdAt,
      },
      playerId: masterPlayer.id,
      isMaster: true,
    };
  }

  async getSessionByToken(token: string) {
    const session = await this.sessionRepository.findOne({
      where: { token },
    });

    if (!session) {
      return null;
    }

    console.log(`📡 API getSessionByToken - rematchVotes from DB:`, session.rematchVotes);

    return {
      id: session.id,
      token: session.token,
      status: session.status,
      config: {
        matchDuration: session.matchDuration,
        responseTime: session.responseTime,
        muteTime: session.muteTime,
        defaultPoints: session.defaultPoints,
      },
      masterId: session.masterId,
      currentRound: session.currentRound,
      isRoundActive: session.isRoundActive,
      currentRoundPoints: session.currentRoundPoints,
      rematchVotes: session.rematchVotes || [],
      createdAt: session.createdAt,
    };
  }

  async joinSession(token: string, pseudo: string, emoji?: string, color?: string) {
    console.log('🎨 joinSession called with:', { token, pseudo, emoji, color });
    
    const session = await this.sessionRepository.findOne({ where: { token } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.LOBBY) {
      throw new BadRequestException('Cannot join session - game already started');
    }

    // Get current players count for color assignment
    const players = await this.playerRepository.find({
      where: { sessionId: session.id },
    });

    // Create new player
    const player = this.playerRepository.create({
      sessionId: session.id,
      pseudo,
      isMaster: false,
      isConnected: true,
      avatar: emoji || getRandomAvatar(),
      color: color || getPlayerColor(players.length),
      score: 0,
    });

    await this.playerRepository.save(player);
    
    console.log('👤 ===== PLAYER SAVED TO DB =====');
    console.log('👤 Avatar:', player.avatar, '| Color:', player.color);
    console.log('👤 ================================');

    return {
      session: await this.getSessionByToken(token),
      playerId: player.id,
      isMaster: false,
    };
  }

  async getSessionPlayers(sessionId: string) {
    const players = await this.playerRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });

    return players.map((p) => ({
      id: p.id,
      pseudo: p.pseudo,
      score: p.score,
      isMaster: p.isMaster,
      isConnected: p.isConnected,
      avatar: p.avatar,
      color: p.color,
      joinedAt: p.createdAt,
      sessionId: p.sessionId,
    }));
  }

  async kickPlayer(sessionId: string, playerId: string) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId, sessionId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (player.isMaster) {
      throw new BadRequestException('Cannot kick master player');
    }

    await this.playerRepository.remove(player);

    // Get session to emit event
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (session) {
      this.gameGateway.emitToRoom(session.token, 'playerKicked', {
        playerId,
        timestamp: new Date(),
      });
    }
  }

  async deleteSession(token: string) {
    const session = await this.sessionRepository.findOne({ where: { token } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Notify all players in the session that it's being deleted
    this.gameGateway.emitToRoom(token, 'sessionDeleted', {
      timestamp: new Date(),
    });

    // Delete all players
    await this.playerRepository.delete({ sessionId: session.id });

    // Delete session
    await this.sessionRepository.remove(session);
  }

  async startGame(token: string) {
    const session = await this.sessionRepository.findOne({ where: { token } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const players = await this.playerRepository.find({
      where: { sessionId: session.id },
    });

    if (players.length < 3) {
      throw new BadRequestException('Minimum 3 players required');
    }

    session.status = SessionStatus.PLAYING;
    session.rematchVotes = []; // Clear rematch votes when starting a new game
    await this.sessionRepository.save(session);

    // Emit event
    this.gameGateway.emitToRoom(token, 'gameStarted', {
      timestamp: new Date(),
    });

    return this.getSessionByToken(token);
  }

  async updateSessionConfig(
    token: string,
    config: {
      matchDuration: number;
      responseTime: number;
      muteTime: number;
      defaultPoints: number;
    },
  ) {
    const session = await this.sessionRepository.findOne({ where: { token } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.LOBBY) {
      throw new BadRequestException('Cannot update config when game is not in lobby');
    }

    // Update session config
    session.matchDuration = config.matchDuration;
    session.responseTime = config.responseTime;
    session.muteTime = config.muteTime;
    session.defaultPoints = config.defaultPoints;

    await this.sessionRepository.save(session);

    return this.getSessionByToken(token);
  }
}
