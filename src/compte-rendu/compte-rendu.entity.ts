import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// Update the path below if the file is located elsewhere, for example:
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { User } from '../auth/user.entity';
import { ActesEntity } from '../actes/actes.entity';

@Entity('compte_rendu')
export class CompteRenduEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RendezVousEntity)
  @JoinColumn({ name: 'rendez_vous_id' })
  rendezVous: RendezVousEntity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'medecin_id' })
  medecin: User;

  @ManyToOne(() => ActesEntity)
  @JoinColumn({ name: 'acte_id' })
  acte: ActesEntity;

  @Column()
  nom_patient: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}
