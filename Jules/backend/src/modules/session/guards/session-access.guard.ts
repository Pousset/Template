import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from '../entities/session.entity';
import { Player } from '../../player/entities/player.entity';

@Injectable()
export class SessionAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;
    const playerId = request.headers['x-player-id'] || request.query.playerId;

    if (!token) {
      throw new UnauthorizedException('Session token is required');
    }

    // Find session
    const session = await this.sessionRepository.findOne({
      where: { token },
    });

    if (!session) {
      throw new ForbiddenException('Session not found');
    }

    // If session is in LOBBY status, allow access (anyone can join)
    if (session.status === SessionStatus.LOBBY) {
      return true;
    }

    // If session is PLAYING or FINISHED, check if player is part of the session
    if (!playerId) {
      throw new UnauthorizedException('Player ID is required for active sessions');
    }

    const player = await this.playerRepository.findOne({
      where: {
        id: playerId,
        sessionId: session.id,
      },
    });

    if (!player) {
      throw new ForbiddenException('You are not part of this session');
    }

    return true;
  }
}
