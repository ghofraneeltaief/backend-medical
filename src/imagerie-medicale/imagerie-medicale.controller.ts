import { Controller, Post, Get, Put, Delete, Param, Body } from "@nestjs/common";
import { ImagerieMedicaleService } from "./imagerie-medicale.service";
import { CreateImagerieDto } from "./dto/create-imagerie.dto";
import { UpdateImagerieDto } from "./dto/update-imagerie.dto";

@Controller("imageries")
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

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.imagerieService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() dto: UpdateImagerieDto) {
    return this.imagerieService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.imagerieService.remove(id);
  }
}
