import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompteRenduEntity } from './compte-rendu.entity';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { User } from '../auth/user.entity';
import { ActesEntity } from '../actes/actes.entity';

@Injectable()
export class CompteRenduService {
  constructor(
    @InjectRepository(CompteRenduEntity)
    private readonly crRepo: Repository<CompteRenduEntity>,
    @InjectRepository(RendezVousEntity)
    private readonly rvRepo: Repository<RendezVousEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(ActesEntity)
    private readonly actesRepo: Repository<ActesEntity>,
  ) {}

  async create(data: {
    id_rv: number;
    id_medecin: number;
    id_acte: number;
    nom_patient: string;
    contenu: string;
  }) {
    const rv = await this.rvRepo.findOne({ where: { id: data.id_rv } });
    const medecin = await this.usersRepo.findOne({ where: { id: data.id_medecin } });
    const acte = await this.actesRepo.findOne({ where: { Id_Acte: data.id_acte } });

    if (!rv) throw new BadRequestException('Rendez-vous invalide');
    if (!medecin || medecin.role !== 'medecin') throw new BadRequestException('Médecin invalide');
    if (!acte) throw new BadRequestException('Acte invalide');

    const compteRendu = this.crRepo.create({
      rendezVous: rv,
      medecin,
      acte,
      nom_patient: data.nom_patient,
      contenu: data.contenu,
    });

    return this.crRepo.save(compteRendu);
  }

  findAll(): Promise<CompteRenduEntity[]> {
    return this.crRepo.find({ relations: ['rendezVous', 'medecin', 'acte'] });
  }

  async findOne(id: number): Promise<CompteRenduEntity> {
    const cr = await this.crRepo.findOne({ where: { id }, relations: ['rendezVous', 'medecin', 'acte'] });
    if (!cr) throw new NotFoundException('Compte-rendu non trouvé');
    return cr;
  }

  async update(id: number, updateData: Partial<CompteRenduEntity>): Promise<CompteRenduEntity> {
    const cr = await this.findOne(id);
    Object.assign(cr, updateData);
    return this.crRepo.save(cr);
  }

  async delete(id: number): Promise<void> {
    const result = await this.crRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Compte-rendu non trouvé');
  }
}
