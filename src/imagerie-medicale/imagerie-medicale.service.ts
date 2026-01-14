import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagerieMedicaleEntity } from './imagerie-medicale.entity';
import { CreateImagerieDto } from './dto/create-imagerie.dto';
import { UpdateImagerieDto } from './dto/update-imagerie.dto';
import { CompteRenduEntity } from '../compte-rendu/compte-rendu.entity';
import { RendezVousEntity } from '../rendez-vous/rendez-vous.entity';
import { FacturesService } from '../factures/factures.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notifications.entity';

@Injectable()
export class ImagerieMedicaleService {
  constructor(
    @InjectRepository(ImagerieMedicaleEntity)
    private imagerieRepo: Repository<ImagerieMedicaleEntity>,

    @InjectRepository(CompteRenduEntity)
    private compteRenduRepo: Repository<CompteRenduEntity>,

    @InjectRepository(RendezVousEntity)
    private rendezVousRepo: Repository<RendezVousEntity>,

    private facturesService: FacturesService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateImagerieDto): Promise<ImagerieMedicaleEntity> {
    let compteRendu: CompteRenduEntity | null = null;
    
    if (dto.compteRenduId && dto.compteRenduId > 0) {
      compteRendu = await this.compteRenduRepo.findOneBy({
        id: dto.compteRenduId,
      });
      if (!compteRendu) throw new NotFoundException('Compte rendu non trouvé');
    }
    
    const rendezVous = await this.rendezVousRepo.findOne({
      where: { id: dto.rendezVousId },
      relations: ['acte'],
    });

    if (!rendezVous) throw new NotFoundException('Rendez-vous non trouvé');

    const imagerie = this.imagerieRepo.create({
      type: dto.type,
      urlImage: dto.urlImage,
      compteRendu,
      rendezVous,
    });

    const savedImagerie = await this.imagerieRepo.save(imagerie);

    // Créer automatiquement une facture avec le statut "non_payee"
    if (rendezVous.acte) {
      try {
        // Vérifier si une facture existe déjà pour ce rendez-vous
        const factureExistante = await this.facturesService.findByRendezVousId(rendezVous.id);

        // Si aucune facture n'existe, en créer une nouvelle
        if (!factureExistante) {
          await this.facturesService.create({
            id_rendez_vous: rendezVous.id,
            id_acte: rendezVous.acte.Id_Acte,
            nom_patient: rendezVous.nom_patient,
            montant: Number(rendezVous.acte.Prix),
            date_facture: new Date().toISOString().split('T')[0],
            statut: 'non_payee',
          });
        }
      } catch (error) {
        // Ne pas bloquer la création de l'imagerie si la facture échoue
        console.error('Erreur lors de la création automatique de la facture:', error);
      }
    }

    // Créer une notification pour les rôles concernés (admin, médecin, médecin radiologue, technicien)
    try {
      const roles = ['admin', 'médecin', 'médecin radiologue', 'technicien'];
      for (const role of roles) {
        await this.notificationsService.createForRole({
          role,
          type: NotificationType.IMAGE,
          title: 'Nouvelle image ajoutée',
          message: `Une nouvelle image de type "${dto.type}" a été ajoutée pour le patient ${rendezVous.nom_patient}`,
          related_id: savedImagerie.id,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }

    return savedImagerie;
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
