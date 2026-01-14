import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotificationEntity, NotificationType } from './notifications.entity';
import { User } from '../auth/user.entity';

// Constantes pour la configuration
const MAX_NOTIFICATIONS_PER_PAGE = 50;
const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepo: Repository<NotificationEntity>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Créer une notification
  async create(data: {
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    related_id?: number;
  }): Promise<NotificationEntity> {
    if (!data.title || !data.message) {
      throw new BadRequestException('Title and message are required');
    }

    const user = await this.usersRepo.findOne({ where: { id: data.user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${data.user_id} not found`);
    }

    const notification = this.notificationsRepo.create({
      user,
      type: data.type,
      title: data.title.trim(),
      message: data.message.trim(),
      related_id: data.related_id,
      is_read: false,
    });

    return this.notificationsRepo.save(notification);
  }

  // Créer une notification pour tous les utilisateurs d'un rôle spécifique (optimisé en batch)
  async createForRole(data: {
    role: string;
    type: NotificationType;
    title: string;
    message: string;
    related_id?: number;
  }): Promise<NotificationEntity[]> {
    if (!data.title || !data.message) {
      throw new BadRequestException('Title and message are required');
    }

    const users = await this.usersRepo.find({ where: { role: data.role } });
    
    if (users.length === 0) {
      return [];
    }

    // Créer toutes les notifications en une seule opération batch
    const notifications = users.map(user =>
      this.notificationsRepo.create({
        user,
        type: data.type,
        title: data.title.trim(),
        message: data.message.trim(),
        related_id: data.related_id,
        is_read: false,
      })
    );

    return this.notificationsRepo.save(notifications);
  }

  // Créer une notification pour tous les utilisateurs (optimisé en batch)
  async createForAllUsers(data: {
    type: NotificationType;
    title: string;
    message: string;
    related_id?: number;
  }): Promise<NotificationEntity[]> {
    if (!data.title || !data.message) {
      throw new BadRequestException('Title and message are required');
    }

    const users = await this.usersRepo.find();
    
    if (users.length === 0) {
      return [];
    }

    // Créer toutes les notifications en une seule opération batch
    const notifications = users.map(user =>
      this.notificationsRepo.create({
        user,
        type: data.type,
        title: data.title.trim(),
        message: data.message.trim(),
        related_id: data.related_id,
        is_read: false,
      })
    );

    return this.notificationsRepo.save(notifications);
  }

  // Définir les types de notifications visibles par rôle
  private getVisibleNotificationTypesForRole(role: string): NotificationType[] {
    const roleMap: Record<string, NotificationType[]> = {
      admin: [
        NotificationType.IMAGE,
        NotificationType.COMPTE_RENDU,
        NotificationType.RENDEZ_VOUS,
        NotificationType.USER,
      ],
      assistante: [
        NotificationType.RENDEZ_VOUS,
      ],
      médecin: [
        NotificationType.IMAGE,
        NotificationType.COMPTE_RENDU,
      ],
      'médecin radiologue': [
        NotificationType.IMAGE,
        NotificationType.COMPTE_RENDU,
      ],
      technicien: [
        NotificationType.IMAGE,
      ],
    };

    return roleMap[role] || [];
  }

  // Récupérer les notifications d'un utilisateur filtrées par rôle avec pagination
  async findByUserId(
    userId: number,
    userRole: string,
    unreadOnly: boolean = false,
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
  ): Promise<{ notifications: NotificationEntity[]; total: number }> {
    const visibleTypes = this.getVisibleNotificationTypesForRole(userRole);
    
    if (visibleTypes.length === 0) {
      return { notifications: [], total: 0 };
    }

    // Créer une copie du query builder pour le count
    const countQueryBuilder = this.notificationsRepo
      .createQueryBuilder('notification')
      .where('notification.user.id = :userId', { userId })
      .andWhere('notification.type IN (:...types)', { types: visibleTypes });
    
    if (unreadOnly) {
      countQueryBuilder.andWhere('notification.is_read = :isRead', { isRead: false });
    }

    // Compter le total
    const total = await countQueryBuilder.getCount();

    // Récupérer les notifications avec limite (nouveau query builder)
    const queryBuilder = this.notificationsRepo
      .createQueryBuilder('notification')
      .where('notification.user.id = :userId', { userId })
      .andWhere('notification.type IN (:...types)', { types: visibleTypes });
    
    if (unreadOnly) {
      queryBuilder.andWhere('notification.is_read = :isRead', { isRead: false });
    }

    const notifications = await queryBuilder
      .orderBy('notification.created_at', 'DESC')
      .limit(Math.min(limit, MAX_NOTIFICATIONS_PER_PAGE))
      .offset(offset)
      .getMany();

    return { notifications, total };
  }

  // Marquer une notification comme lue (optimisé avec update direct)
  async markAsRead(id: number, userId: number): Promise<NotificationEntity> {
    // Vérifier d'abord que la notification appartient à l'utilisateur
    const notification = await this.notificationsRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Mettre à jour
    notification.is_read = true;
    return this.notificationsRepo.save(notification);
  }

  // Marquer toutes les notifications comme lues pour un utilisateur
  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationsRepo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ is_read: true })
      .where('user_id = :userId', { userId })
      .andWhere('is_read = :isRead', { isRead: false })
      .execute();
  }

  // Compter les notifications non lues filtrées par rôle
  async countUnread(userId: number, userRole: string): Promise<number> {
    const visibleTypes = this.getVisibleNotificationTypesForRole(userRole);
    
    if (visibleTypes.length === 0) {
      return 0;
    }

    return this.notificationsRepo
      .createQueryBuilder('notification')
      .innerJoin('notification.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('notification.is_read = :isRead', { isRead: false })
      .andWhere('notification.type IN (:...types)', { types: visibleTypes })
      .getCount();
  }

  // Supprimer une notification
  async delete(id: number, userId: number): Promise<void> {
    const result = await this.notificationsRepo.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  // Nettoyer les anciennes notifications (plus de 30 jours)
  async cleanOldNotifications(daysOld: number = 30): Promise<number> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - daysOld);

    const result = await this.notificationsRepo
      .createQueryBuilder()
      .delete()
      .where('created_at < :dateLimit', { dateLimit })
      .andWhere('is_read = :isRead', { isRead: true })
      .execute();

    return result.affected || 0;
  }
}
