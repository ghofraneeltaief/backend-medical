import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagerieMedicaleEntity } from './imagerie-medicale.entity';
import { CreateImagerieDto } from './dto/create-imagerie.dto';
import { UpdateImagerieDto } from './dto/update-imagerie.dto';
import { CompteRenduEntity } from '../compte-rendu/compte-rendu.entity';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';

@Injectable()
export class ImagerieMedicaleService {
  constructor(
    @InjectRepository(ImagerieMedicaleEntity)
    private imagerieRepo: Repository<ImagerieMedicaleEntity>,

    @InjectRepository(CompteRenduEntity)
    private compteRenduRepo: Repository<CompteRenduEntity>,

    @InjectRepository(RendezVousEntity)
    private rendezVousRepo: Repository<RendezVousEntity>,
  ) {}

  async create(dto: CreateImagerieDto): Promise<ImagerieMedicaleEntity> {
    let compteRendu: CompteRenduEntity | null = null;
    
    if (dto.compteRenduId && dto.compteRenduId > 0) {
      compteRendu = await this.compteRenduRepo.findOneBy({
        id: dto.compteRenduId,
      });
      if (!compteRendu) throw new NotFoundException('Compte rendu non trouvé');
    }
    
    const rendezVous = await this.rendezVousRepo.findOneBy({
      id: dto.rendezVousId,
    });

    if (!rendezVous) throw new NotFoundException('Rendez-vous non trouvé');

    const imagerie = this.imagerieRepo.create({
      type: dto.type,
      urlImage: dto.urlImage,
      compteRendu,
      rendezVous,
    });

    return await this.imagerieRepo.save(imagerie);
  }

  findAll(): Promise<ImagerieMedicaleEntity[]> {
    return this.imagerieRepo.find({
      relations: {
        rendezVous: {
          acte: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<ImagerieMedicaleEntity> {
    const imagerie = await this.imagerieRepo.findOne({
      where: { id },
      relations: {
        rendezVous: {
          acte: true,
        },
      },
    });

    if (!imagerie) throw new NotFoundException('Imagerie non trouvée');
    return imagerie;
  }

  async update(
    id: number,
    dto: UpdateImagerieDto,
  ): Promise<ImagerieMedicaleEntity> {
    const imagerie = await this.findOne(id);

    if (dto.type) imagerie.type = dto.type;
    if (dto.urlImage) imagerie.urlImage = dto.urlImage;

    if (dto.compteRenduId) {
      const compteRendu = await this.compteRenduRepo.findOneBy({
        id: dto.compteRenduId,
      });
      if (!compteRendu) throw new NotFoundException('Compte rendu non trouvé');
      imagerie.compteRendu = compteRendu;
    }

    if (dto.rendezVousId) {
      const rendezVous = await this.rendezVousRepo.findOneBy({
        id: dto.rendezVousId,
      });
      if (!rendezVous) throw new NotFoundException('Rendez-vous non trouvé');
      imagerie.rendezVous = rendezVous;
    }

    return await this.imagerieRepo.save(imagerie);
  }

  async remove(id: number): Promise<void> {
    const imagerie = await this.findOne(id);
    await this.imagerieRepo.remove(imagerie);
  }
}
