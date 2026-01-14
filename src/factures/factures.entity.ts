import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { ActesEntity } from '../actes/actes.entity';

@Entity('factures')
export class FactureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RendezVousEntity)
  @JoinColumn({ name: 'id_rendez_vous' })
  rendezVous: RendezVousEntity;

  @ManyToOne(() => ActesEntity)
  @JoinColumn({ name: 'id_acte' })
  acte: ActesEntity;

  @Column()
  nom_patient: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'date' })
  date_facture: string;

  @Column({ default: 'non_payee' })
  statut: string; // 'payee' ou 'non_payee'

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}
