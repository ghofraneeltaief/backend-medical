import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RendezVousEntity } from './rendez-vous.entity';
import { User } from '../auth/user.entity';
import { ActesEntity } from '../actes/actes.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notifications.entity';

@Injectable()
export class RendezVousService {
  constructor(
    @InjectRepository(RendezVousEntity)
    private readonly rvRepo: Repository<RendezVousEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(ActesEntity)
    private readonly actesRepo: Repository<ActesEntity>,
    private notificationsService: NotificationsService,
  ) {}

  async create(rvData: { id_acte: number; id_medecin: number; nom_patient: string; date: string; heure: string }) {
    const acte = await this.actesRepo.findOne({ where: { Id_Acte: rvData.id_acte } });
    const medecin = await this.usersRepo.findOne({ where: { id: rvData.id_medecin } });

    if (!acte) throw new BadRequestException('Acte invalide');
    if (!medecin || medecin.role !== 'médecin') throw new BadRequestException('Médecin invalide');

    const rv = this.rvRepo.create({
      acte,
      medecin,
      nom_patient: rvData.nom_patient,
      date: rvData.date,
      heure: rvData.heure,
    });

    const savedRv = await this.rvRepo.save(rv);

    // Créer une notification pour les rôles concernés (admin, assistante)
    try {
      const roles = ['admin', 'assistante'];
      for (const role of roles) {
        await this.notificationsService.createForRole({
          role,
          type: NotificationType.RENDEZ_VOUS,
          title: 'Nouveau rendez-vous créé',
          message: `Un nouveau rendez-vous a été créé pour ${rvData.nom_patient} le ${rvData.date} à ${rvData.heure} (${acte.Nom_Acte})`,
          related_id: savedRv.id,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }

    return savedRv;
  }

  findAll(): Promise<RendezVousEntity[]> {
    return this.rvRepo.find({ relations: ['acte', 'medecin'] });
  }

  async findOne(id: number): Promise<RendezVousEntity> {
    const rv = await this.rvRepo.findOne({ where: { id }, relations: ['acte', 'medecin'] });
    if (!rv) throw new NotFoundException('Rendez-vous non trouvé');
    return rv;
  }

  async update(id: number, updateData: Partial<RendezVousEntity> & { id_acte?: number; id_medecin?: number }): Promise<RendezVousEntity> {
    const rv = await this.findOne(id);
    
    // Si id_acte est fourni, charger l'acte
    if (updateData.id_acte !== undefined) {
      const acte = await this.actesRepo.findOne({ where: { Id_Acte: updateData.id_acte } });
      if (!acte) throw new BadRequestException('Acte invalide');
      rv.acte = acte;
      delete (updateData as any).id_acte;
    }
    
    // Si id_medecin est fourni, charger le médecin
    if (updateData.id_medecin !== undefined) {
      const medecin = await this.usersRepo.findOne({ where: { id: updateData.id_medecin } });
      if (!medecin || medecin.role !== 'médecin') throw new BadRequestException('Médecin invalide');
      rv.medecin = medecin;
      delete (updateData as any).id_medecin;
    }
    
    // Mettre à jour les autres champs
    Object.assign(rv, updateData);
    return this.rvRepo.save(rv);
  }

  async delete(id: number): Promise<void> {
    const result = await this.rvRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Rendez-vous non trouvé');
  }
}
