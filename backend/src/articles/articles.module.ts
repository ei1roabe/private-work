import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 💡 追加

@Module({
  imports: [PrismaModule], // 💡 追加
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
