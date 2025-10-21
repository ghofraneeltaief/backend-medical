import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActesEntity } from './actes.entity';

@Injectable()
export class ActesService {
  constructor(
    @InjectRepository(ActesEntity)
    private readonly actesRepo: Repository<ActesEntity>,
  ) {}

  // Créer un acte
  create(acteData: Partial<ActesEntity>): Promise<ActesEntity> {
    const acte = this.actesRepo.create(acteData);
    return this.actesRepo.save(acte);
  }

  // Récupérer tous les actes
  findAll(): Promise<ActesEntity[]> {
    return this.actesRepo.find();
  }

  // Récupérer un acte par Id
  async findOne(id: number): Promise<ActesEntity> {
    const acte = await this.actesRepo.findOne({ where: { Id_Acte: id } });
    if (!acte) throw new NotFoundException('Acte not found');
    return acte;
  }

  // Mettre à jour un acte
  async update(id: number, updateData: Partial<ActesEntity>): Promise<ActesEntity> {
    const acte = await this.findOne(id);
    Object.assign(acte, updateData);
    return this.actesRepo.save(acte);
  }

  // Supprimer un acte
  async delete(id: number): Promise<void> {
    const result = await this.actesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Acte not found');
  }
}
