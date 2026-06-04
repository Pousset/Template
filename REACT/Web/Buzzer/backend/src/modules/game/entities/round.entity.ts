import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Player } from '../../player/entities/player.entity';

export enum RoundStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BUZZED = 'BUZZED',
  COMPLETED = 'COMPLETED',
}

@Entity('rounds')
@Unique(['sessionId', 'roundNumber'])
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.rounds)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column()
  roundNumber: number;

  @Column()
  points: number;

  @Column({
    type: 'enum',
    enum: RoundStatus,
    default: RoundStatus.PENDING,
  })
  status: RoundStatus;

  @Column({ nullable: true })
  buzzedById: string;

  @ManyToOne(() => Player, (player) => player.buzzes)
  @JoinColumn({ name: 'buzzedById' })
  buzzedBy: Player;

  @Column({ type: 'timestamp', nullable: true })
  buzzedAt: Date;

  @Column({ nullable: true })
  answeredCorrectly: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
