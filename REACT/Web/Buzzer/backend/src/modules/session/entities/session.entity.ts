import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { Round } from '../../game/entities/round.entity';

export enum SessionStatus {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.LOBBY,
  })
  status: SessionStatus;

  @Column({ default: 5, comment: 'Temps de mute après mauvaise réponse (secondes)' })
  muteTime: number;

  @Column({ default: 10, comment: 'Temps de réponse après buzz (secondes)' })
  responseTime: number;

  @Column({ default: 30, comment: 'Nombre de manches' })
  matchDuration: number;

  @Column({ default: 1, comment: 'Points par défaut par manche' })
  defaultPoints: number;

  @Column({ default: 0 })
  currentRound: number;

  @Column({ default: false })
  isRoundActive: boolean;

  @Column({ default: 1 })
  currentRoundPoints: number; // Points en jeu pour la manche actuelle

  @Column({ type: 'json', nullable: true })
  rematchVotes: string[]; // Array of player IDs who voted for rematch

  @Column()
  masterId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Player, (player) => player.session)
  players: Player[];

  @OneToMany(() => Round, (round) => round.session)
  rounds: Round[];
}
