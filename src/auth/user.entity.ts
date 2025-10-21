import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';

@Entity('users') // nom de la table
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => RendezVousEntity, (rdv) => rdv.medecin)
  rendezVous: RendezVousEntity[];
}
