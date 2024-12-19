import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { Prisma } from "@prisma/client";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() data: Prisma.ArticleCreateInput) {
    return this.articlesService.createArticle(data);
  }

  @Get()
  async findAll() {
    return this.articlesService.getArticles();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.articlesService.getArticleById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: Prisma.ArticleUpdateInput
  ) {
    return this.articlesService.updateArticle(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.articlesService.deleteArticle(id);
  }
}
