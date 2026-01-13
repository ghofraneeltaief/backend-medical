import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ImagerieMedicaleService } from './imagerie-medicale.service';
import { CreateImagerieDto } from './dto/create-imagerie.dto';
import { UpdateImagerieDto } from './dto/update-imagerie.dto';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('imageries')
export class ImagerieMedicaleController {
  constructor(private readonly imagerieService: ImagerieMedicaleService) {}

  @Post()
  create(@Body() dto: CreateImagerieDto) {
    return this.imagerieService.create(dto);
  }

  @Get()
  findAll() {
    return this.imagerieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.imagerieService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateImagerieDto) {
    return this.imagerieService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.imagerieService.remove(id);
  }

  @Post('upload-and-save')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/imageries',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadAndSave(
    @UploadedFile() file: any,
    @Body('type') type: string,
    @Body('rendezVousId') rendezVousId: number,
    @Body('compteRenduId') compteRenduId?: number,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier envoyé');

    const urlImage = `/uploads/imageries/${file.filename}`;

    return await this.imagerieService.create({
      type,
      urlImage,
      rendezVousId,
      compteRenduId: compteRenduId && compteRenduId > 0 ? compteRenduId : undefined,
    });
  }
}
