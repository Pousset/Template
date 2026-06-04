import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Round } from '../../game/entities/round.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.players)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column()
  pseudo: string;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  isMaster: boolean;

  @Column({ default: true })
  isConnected: boolean;

  @Column({ nullable: true })
  socketId: string;

  @Column({ nullable: true, comment: 'Emoji avatar' })
  avatar: string;

  @Column({ nullable: true, comment: 'Tailwind color class' })
  color: string;

  @Column({ type: 'timestamp', nullable: true })
  mutedUntil: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Round, (round) => round.buzzedBy)
  buzzes: Round[];
}
