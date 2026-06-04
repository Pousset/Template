import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
import { Session, SessionStatus } from '../session/entities/session.entity';

interface JoinSessionPayload {
  token: string;
  playerId: string;
  isMaster: boolean;
}

interface LeaveSessionPayload {
  token: string;
  playerId: string;
}

interface KickPlayerPayload {
  token: string;
  playerId: string;
}

interface StartGamePayload {
  token: string;
}

interface StartRoundPayload {
  token: string;
  points: number;
}

interface BuzzPayload {
  token: string;
  playerId: string;
}

interface ValidateAnswerPayload {
  token: string;
  playerId: string;
  points: number;
}

interface InvalidateAnswerPayload {
  token: string;
  playerId: string;
}

interface ResetBuzzerPayload {
  token: string;
}

interface RematchVotePayload {
  token: string;
  playerId: string;
  vote: boolean; // true = yes, false = no
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @MessageBody() data: JoinSessionPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const { token, playerId, isMaster } = data;
    this.logger.log(`Player ${playerId} joining session ${token}`);

    // Join room
    client.join(token);

    // Notify others in the room
    client.to(token).emit('playerJoined', {
      playerId,
      isMaster,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @MessageBody() data: LeaveSessionPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const { token, playerId } = data;
    this.logger.log(`Player ${playerId} leaving session ${token}`);

    // Leave room
    client.leave(token);

    // Notify others in the room
    client.to(token).emit('playerLeft', {
      playerId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('kickPlayer')
  handleKickPlayer(
    @MessageBody() data: KickPlayerPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const { token, playerId } = data;
    this.logger.log(`Player ${playerId} kicked from session ${token}`);

    // Notify all in the room
    this.server.to(token).emit('playerKicked', {
      playerId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: StartGamePayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const { token } = data;
    this.logger.log(`Game starting for session ${token}`);

    // Notify all in the room
    this.server.to(token).emit('gameStarted', {
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('sessionUpdated')
  handleSessionUpdated(
    @MessageBody() data: { token: string; session: any },
    @ConnectedSocket() client: Socket,
  ): void {
    const { token, session } = data;
    this.logger.log(`Session ${token} updated`);

    // Notify all in the room
    this.server.to(token).emit('sessionUpdated', {
      session,
      timestamp: new Date(),
    });
  }

  // === Round Management Events ===

  @SubscribeMessage('startRound')
  async handleStartRound(
    @MessageBody() data: StartRoundPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token, points } = data;
    this.logger.log(`🚀 Round starting for session ${token} with ${points} points`);
    
    // Find and increment currentRound in the session
    const session = await this.sessionRepository.findOne({ where: { token } });
    if (session) {
      session.currentRound += 1;
      session.isRoundActive = true;
      session.currentRoundPoints = points;
      await this.sessionRepository.save(session);
      this.logger.log(`📊 Round ${session.currentRound} of session ${token} - isRoundActive: true - points: ${points}`);
    }
    
    this.logger.log(`📢 Emitting roundStarted to room: ${token}`);

    // Notify all in the room
    this.server.to(token).emit('roundStarted', {
      points,
      currentRound: session?.currentRound || 1,
      timestamp: new Date(),
    });
    
    this.logger.log(`✅ roundStarted event emitted`);
  }

  @SubscribeMessage('buzz')
  async handleBuzz(
    @MessageBody() data: BuzzPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token, playerId } = data;
    
    // Get player info from database
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    
    if (!player) {
      this.logger.error(`Player ${playerId} not found`);
      return;
    }

    // Check if player is muted
    if (player.mutedUntil && new Date() < player.mutedUntil) {
      this.logger.warn(`Player ${player.pseudo} tried to buzz while muted`);
      // Optionally notify the player that they're still muted
      client.emit('buzzerBlocked', {
        reason: 'muted',
        mutedUntil: player.mutedUntil,
        timestamp: new Date(),
      });
      return;
    }

    this.logger.log(`Player ${player.pseudo} buzzed in session ${token}`);

    // Notify all in the room
    this.server.to(token).emit('buzzed', {
      playerId,
      pseudo: player.pseudo,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('validateAnswer')
  async handleValidateAnswer(
    @MessageBody() data: ValidateAnswerPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token, playerId, points } = data;
    
    // Get session and player info from database
    const session = await this.sessionRepository.findOne({ where: { token } });
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    
    if (!player) {
      this.logger.error(`Player ${playerId} not found`);
      return;
    }
    
    // Update player score in database
    player.score += points;
    
    // Clear mute status on correct answer
    player.mutedUntil = null;
    
    await this.playerRepository.save(player);
    
    this.logger.log(`Answer validated for player ${player.pseudo} in session ${token} (+${points} points, total: ${player.score})`);

    // Check if game is finished
    const isGameFinished = session && session.currentRound >= session.matchDuration;
    
    if (isGameFinished) {
      this.logger.log(`🏁 Game finished for session ${token}`);
      
      // Update session status
      session.status = 'FINISHED' as any;
      session.isRoundActive = false;
      await this.sessionRepository.save(session);
    } else if (session) {
      // End the round
      session.isRoundActive = false;
      await this.sessionRepository.save(session);
    }

    // Notify all in the room
    this.server.to(token).emit('answerValidated', {
      playerId,
      pseudo: player.pseudo,
      points,
      isGameFinished,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('invalidateAnswer')
  async handleInvalidateAnswer(
    @MessageBody() data: InvalidateAnswerPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token, playerId } = data;
    this.logger.log(`Answer invalidated for player ${playerId} in session ${token}`);

    // Get session and player
    const session = await this.sessionRepository.findOne({ where: { token } });
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    
    if (session && player) {
      // End the round
      session.isRoundActive = false;
      await this.sessionRepository.save(session);
      
      // Mute the player for muteTime seconds
      const muteSeconds = session.muteTime;
      player.mutedUntil = new Date(Date.now() + muteSeconds * 1000);
      await this.playerRepository.save(player);
      
      this.logger.log(`🔇 Player ${player.pseudo} muted until ${player.mutedUntil.toISOString()}`);
    }

    // Notify all in the room
    this.server.to(token).emit('answerInvalidated', {
      playerId,
      mutedUntil: player?.mutedUntil,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('resetBuzzer')
  async handleResetBuzzer(
    @MessageBody() data: ResetBuzzerPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token } = data;
    this.logger.log(`Buzzer reset for session ${token}`);

    // End the round
    const session = await this.sessionRepository.findOne({ where: { token } });
    if (session) {
      session.isRoundActive = false;
      await this.sessionRepository.save(session);
    }

    // Notify all in the room
    this.server.to(token).emit('buzzerReset', {
      timestamp: new Date(),
    });
  }

  // === Rematch System ===

  @SubscribeMessage('voteRematch')
  async handleRematchVote(
    @MessageBody() data: RematchVotePayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { token, playerId, vote } = data;
    
    this.logger.log(`🗳️ Vote received: playerId=${playerId}, vote=${vote}, token=${token}`);
    
    const session = await this.sessionRepository.findOne({ where: { token } });
    if (!session) {
      this.logger.error(`Session ${token} not found`);
      return;
    }

    this.logger.log(`📊 Before vote - rematchVotes: [${session.rematchVotes?.join(', ') || 'empty'}]`);

    // Initialize rematchVotes if null
    if (!session.rematchVotes) {
      session.rematchVotes = [];
      this.logger.log(`🆕 Initialized rematchVotes to empty array`);
    }

    const wasVoting = session.rematchVotes.includes(playerId);
    this.logger.log(`Was already voting: ${wasVoting}`);

    if (vote) {
      // Add vote if not already present
      if (!session.rematchVotes.includes(playerId)) {
        session.rematchVotes.push(playerId);
        this.logger.log(`✅ Added playerId to rematchVotes. New array: [${session.rematchVotes.join(', ')}]`);
      } else {
        this.logger.log(`⚠️ PlayerId already in rematchVotes`);
      }
      
      // If this is the first vote for this player, reset game state
      if (!wasVoting) {
        // Reset game state on first YES vote
        if (session.rematchVotes.length === 1) {
          session.currentRound = 0;
          session.isRoundActive = false;
          session.status = SessionStatus.LOBBY;
          
          // Reset all player scores
          const players = await this.playerRepository.find({
            where: { sessionId: session.id },
          });
          for (const player of players) {
            player.score = 0;
            await this.playerRepository.save(player);
          }
          
          this.logger.log(`🔄 First rematch vote - game reset for session ${token}`);
        }
        
        // Save session after adding vote
        await this.sessionRepository.save(session);
        
        this.logger.log(`💾 Session saved with rematchVotes: [${session.rematchVotes.join(', ')}]`);
        
        // Notify this specific player to go to lobby via room (with playerId)
        this.server.to(token).emit('rematchAcceptedForYou', {
          playerId,
          timestamp: new Date(),
        });
        
        this.logger.log(`✅ Player ${playerId} accepted rematch and will be redirected to lobby`);
      }
    } else {
      // Remove vote if present
      session.rematchVotes = session.rematchVotes.filter(id => id !== playerId);
      this.logger.log(`❌ Removed playerId from rematchVotes. New array: [${session.rematchVotes.join(', ')}]`);
      await this.sessionRepository.save(session);
    }

    // Get all players
    const players = await this.playerRepository.find({
      where: { sessionId: session.id },
    });

    this.logger.log(`📢 About to emit rematchVoteUpdated - votes: ${session.rematchVotes.length}/${players.length}`);
    this.logger.log(`📢 Final rematchVotes in session: [${session.rematchVotes.join(', ')}]`);

    // Notify all about vote update
    this.server.to(token).emit('rematchVoteUpdated', {
      votes: session.rematchVotes.length,
      required: players.length,
      timestamp: new Date(),
    });
  }

  // Helper method to emit to a specific room
  emitToRoom(token: string, event: string, data: any): void {
    this.server.to(token).emit(event, data);
  }
}
