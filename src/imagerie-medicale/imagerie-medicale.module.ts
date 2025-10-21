import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagerieMedicaleEntity } from "./imagerie-medicale.entity";
import { CompteRenduEntity } from "../compte-rendu/compte-rendu.entity";
import { RendezVousEntity } from "../rendez-vous/rendez-vous.entity";
import { ImagerieMedicaleService } from "./imagerie-medicale.service";
import { ImagerieMedicaleController } from "./imagerie-medicale.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ImagerieMedicaleEntity, CompteRenduEntity, RendezVousEntity])],
  controllers: [ImagerieMedicaleController],
  providers: [ImagerieMedicaleService],
})
export class ImagerieMedicaleModule {}
