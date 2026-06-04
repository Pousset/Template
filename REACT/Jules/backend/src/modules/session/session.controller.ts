import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { GameGateway } from '@/modules/game/game.gateway';
import { SessionAccessGuard } from './guards/session-access.guard';

interface CreateSessionDto {
  masterPseudo: string;
  emoji?: string;
  color?: string;
  config: {
    matchDuration: number;
    responseTime: number;
    muteTime: number;
    defaultPoints: number;
  };
}

interface JoinSessionDto {
  pseudo: string;
  emoji?: string;
  color?: string;
}

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    @Inject(GameGateway) private readonly gameGateway: GameGateway,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.createSession(
      createSessionDto.masterPseudo,
      createSessionDto.config,
      createSessionDto.emoji,
      createSessionDto.color,
    );
  }

  @Get(':token')
  @UseGuards(SessionAccessGuard)
  async getSession(@Param('token') token: string) {
    const session = await this.sessionService.getSessionByToken(token);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  @Post(':token/join')
  @HttpCode(HttpStatus.OK)
  async joinSession(
    @Param('token') token: string,
    @Body() joinSessionDto: JoinSessionDto,
  ) {
    const response = await this.sessionService.joinSession(
      token, 
      joinSessionDto.pseudo,
      joinSessionDto.emoji,
      joinSessionDto.color
    );
    
    // Emit socket event to notify other players
    if (response.playerId) {
      this.gameGateway.emitToRoom(token, 'playerJoined', {
        playerId: response.playerId,
        pseudo: joinSessionDto.pseudo,
        isMaster: response.isMaster,
        timestamp: new Date(),
      });
    }

    return response;
  }

  @Get(':token/players')
  @UseGuards(SessionAccessGuard)
  async getSessionPlayers(@Param('token') token: string) {
    const session = await this.sessionService.getSessionByToken(token);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.sessionService.getSessionPlayers(session.id);
  }

  @Delete(':token/players/:playerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async kickPlayer(
    @Param('token') token: string,
    @Param('playerId') playerId: string,
  ) {
    const session = await this.sessionService.getSessionByToken(token);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.sessionService.kickPlayer(session.id, playerId);
    
    // Emit socket event to notify other players
    this.gameGateway.emitToRoom(token, 'playerKicked', {
      playerId,
      timestamp: new Date(),
    });
  }

  @Delete(':token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Param('token') token: string) {
    await this.sessionService.deleteSession(token);
  }

  @Post(':token/start')
  @HttpCode(HttpStatus.OK)
  async startGame(@Param('token') token: string) {
    return this.sessionService.startGame(token);
  }

  @Post(':token/config')
  @HttpCode(HttpStatus.OK)
  async updateConfig(
    @Param('token') token: string,
    @Body() config: {
      matchDuration: number;
      responseTime: number;
      muteTime: number;
      defaultPoints: number;
    },
  ) {
    const session = await this.sessionService.getSessionByToken(token);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.sessionService.updateSessionConfig(token, config);
  }
}
