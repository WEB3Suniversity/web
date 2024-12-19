import { Module } from "@nestjs/common";
import { ArticlesModule } from "./articles/articles.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [ArticlesModule],
  providers: [PrismaService],
})
export class AppModule {}