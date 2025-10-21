import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('actes') // nom de la table
export class ActesEntity {
  @PrimaryGeneratedColumn()
  Id_Acte: number;

  @Column()
  Nom_Acte: string;

  @Column()
  Prix: number;
}