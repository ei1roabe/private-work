import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // 記事を全件取得する
  async findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 記事を新規作成する
  async create(data: { title: string; content: string }) {
    return this.prisma.article.create({
      data,
    });
  }

  // 記事を1件だけ取得する
  async findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id: id },
    });
  }

  // 記事を更新する
  async update(id: string, data: { title: string; content: string }) {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  // 記事を削除する
  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id: id },
    });
  }
}
