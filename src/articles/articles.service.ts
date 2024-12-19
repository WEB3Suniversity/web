import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async createArticle(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({
      data,
    });
  }

  async getArticles() {
    return this.prisma.article.findMany();
  }

  async getArticleById(id: string) {
    return this.prisma.article.findUnique({
      where: { article_id: id },
    });
  }

  async updateArticle(id: string, data: Prisma.ArticleUpdateInput) {
    return this.prisma.article.update({
      where: { article_id: id },
      data,
    });
  }

  async deleteArticle(id: string) {
    return this.prisma.article.delete({
      where: { article_id: id },
    });
  }
}
