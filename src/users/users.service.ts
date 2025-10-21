import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.usersRepo.find(); // SELECT * FROM users
  }

  async findByName(name: string, lastName: string): Promise<User[]> {
    return this.usersRepo.find({
      where: { name, lastName },
    });
  }

  // Update user
  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    Object.assign(user, updateData);
    return this.usersRepo.save(user);
  }

  // Delete user
  async delete(id: number): Promise<void> {
    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }
}
