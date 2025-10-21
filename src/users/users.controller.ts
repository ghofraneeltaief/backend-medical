import { Controller, Put, Delete, Param, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../auth/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // GET /users → récupérer tous les utilisateurs
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET /users/search?name=John&lastname=Doe
  @Get('search')
  async findByName(
    @Query('name') name: string,
    @Query('lastName') lastName: string,
  ): Promise<User[]> {
    return this.usersService.findByName(name, lastName);
  }

  // PUT /users/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<User>) {
    return this.usersService.update(id, body);
  }

  // DELETE /users/:id
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
