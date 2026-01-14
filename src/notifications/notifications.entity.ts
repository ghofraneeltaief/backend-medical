import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';

export enum NotificationType {
  IMAGE = 'image',
  COMPTE_RENDU = 'compte_rendu',
  RENDEZ_VOUS = 'rendez_vous',
  USER = 'user',
}

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  related_id: number; // ID de l'image, compte rendu, rendez-vous, etc.

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
