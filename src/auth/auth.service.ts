import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, lastName: string,email: string, password: string, role: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({name, lastName, email, password: hashed, role });
    return this.usersRepo.save(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role ,name: user.name,
    lastName: user.lastName,};
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role, // utile pour le frontend
    };
  }
}
