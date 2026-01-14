import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationType } from './notifications.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role || 'technicien';
    return this.notificationsService.findByUserId(userId, userRole, false, limit, offset);
  }

  @Get('unread')
  async findUnread(
    @Request() req: any,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role || 'technicien';
    return this.notificationsService.findByUserId(userId, userRole, true, limit, offset);
  }

  @Get('count')
  async countUnread(@Request() req: any) {
    const userId = req.user.sub;
    const userRole = req.user.role || 'technicien';
    return { count: await this.notificationsService.countUnread(userId, userRole) };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.sub;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user.sub;
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.sub;
    await this.notificationsService.delete(id, userId);
    return { message: 'Notification deleted' };
  }

  @Post()
  async create(@Body() body: {
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    related_id?: number;
  }) {
    return this.notificationsService.create(body);
  }
}
