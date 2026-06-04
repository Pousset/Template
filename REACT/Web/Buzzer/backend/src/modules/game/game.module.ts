import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { Player } from '../player/entities/player.entity';
import { Session } from '../session/entities/session.entity';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Round, Player, Session])],
  providers: [GameGateway],
  exports: [TypeOrmModule, GameGateway],
})
export class GameModule {}
