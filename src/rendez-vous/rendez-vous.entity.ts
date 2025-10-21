import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ActesEntity } from '../actes/actes.entity';
import { User } from '../auth/user.entity';

@Entity('rendez_vous')
export class RendezVousEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActesEntity)
  @JoinColumn({ name: 'id_acte' })
  acte: ActesEntity;

  // Relation vers le médecin
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_medecin' })
  medecin: User;

  // Nom du patient (libre)
  @Column()
  nom_patient: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  heure: string;
}
