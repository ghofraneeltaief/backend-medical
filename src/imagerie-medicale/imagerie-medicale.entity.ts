import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CompteRenduEntity } from "../compte-rendu/compte-rendu.entity";
import { RendezVousEntity } from "../rendez-vous/rendez-vous.entity";

@Entity("imageries_medicales")
export class ImagerieMedicaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // Exemple: "Radio", "IRM", "Scanner"

  @Column()
  urlImage: string; // chemin ou URL de l’image

  @ManyToOne(() => CompteRenduEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "compteRenduId" })
  compteRendu: CompteRenduEntity;

  @ManyToOne(() => RendezVousEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "rendezVousId" })
  rendezVous: RendezVousEntity;
}
