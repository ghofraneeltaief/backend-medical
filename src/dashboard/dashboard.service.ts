import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActesEntity } from '../actes/actes.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ActesEntity) private readonly acteRepo: Repository<ActesEntity>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getOverviewData() {
    const [actes, medecins, techniciens, radiologues] = await Promise.all([
      this.acteRepo.count(),
      this.userRepo.count({ where: { role: 'MEDECIN' } }),
      this.userRepo.count({ where: { role: 'TECHNICIEN' } }),
      this.userRepo.count({ where: { role: 'MEDECIN RADIOLOGUE' } }),
    ]);

    return {
      actes: { value: actes },
      medecins: { value: medecins },
      techniciens: { value: techniciens },
      radiologues: { value: radiologues },
    };
  }
}
