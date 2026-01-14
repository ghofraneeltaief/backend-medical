import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactureEntity } from './factures.entity';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { ActesEntity } from '../actes/actes.entity';

@Injectable()
export class FacturesService {
  constructor(
    @InjectRepository(FactureEntity)
    private readonly facturesRepo: Repository<FactureEntity>,
    @InjectRepository(RendezVousEntity)
    private readonly rvRepo: Repository<RendezVousEntity>,
    @InjectRepository(ActesEntity)
    private readonly actesRepo: Repository<ActesEntity>,
  ) {}

  async create(data: {
    id_rendez_vous: number;
    id_acte: number;
    nom_patient: string;
    montant: number;
    date_facture: string;
    statut?: string;
  }): Promise<FactureEntity> {
    const rv = await this.rvRepo.findOne({ where: { id: data.id_rendez_vous } });
    if (!rv) throw new NotFoundException('Rendez-vous non trouvé');

    const acte = await this.actesRepo.findOne({ where: { Id_Acte: data.id_acte } });
    if (!acte) throw new NotFoundException('Acte non trouvé');

    const facture = this.facturesRepo.create({
      rendezVous: rv,
      acte: acte,
      nom_patient: data.nom_patient,
      montant: data.montant,
      date_facture: data.date_facture,
      statut: data.statut || 'non_payee',
    });

    return this.facturesRepo.save(facture);
  }

  async findAll(): Promise<FactureEntity[]> {
    return this.facturesRepo.find({
      relations: ['rendezVous', 'acte'],
      order: { date_creation: 'DESC' },
    });
  }

  async findByRendezVousId(id_rendez_vous: number): Promise<FactureEntity | null> {
    return this.facturesRepo.findOne({
      where: { rendezVous: { id: id_rendez_vous } },
      relations: ['rendezVous', 'acte'],
    });
  }

  async findOne(id: number): Promise<FactureEntity> {
    const facture = await this.facturesRepo.findOne({
      where: { id },
      relations: ['rendezVous', 'acte'],
    });
    if (!facture) throw new NotFoundException('Facture non trouvée');
    return facture;
  }

  async update(id: number, updateData: Partial<FactureEntity> & { id_acte?: number; id_rendez_vous?: number }): Promise<FactureEntity> {
    const facture = await this.findOne(id);

    if (updateData.id_acte !== undefined) {
      const acte = await this.actesRepo.findOne({ where: { Id_Acte: updateData.id_acte } });
      if (!acte) throw new NotFoundException('Acte non trouvé');
      facture.acte = acte;
      delete (updateData as any).id_acte;
    }

    if (updateData.id_rendez_vous !== undefined) {
      const rv = await this.rvRepo.findOne({ where: { id: updateData.id_rendez_vous } });
      if (!rv) throw new NotFoundException('Rendez-vous non trouvé');
      facture.rendezVous = rv;
      delete (updateData as any).id_rendez_vous;
    }

    Object.assign(facture, updateData);
    return this.facturesRepo.save(facture);
  }

  async delete(id: number): Promise<void> {
    const result = await this.facturesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Facture non trouvée');
  }
}
