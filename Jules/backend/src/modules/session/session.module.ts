import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Player } from '../player/entities/player.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionAccessGuard } from './guards/session-access.guard';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Player]),
    GameModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionAccessGuard],
  exports: [TypeOrmModule, SessionService],
})
export class SessionModule {}
