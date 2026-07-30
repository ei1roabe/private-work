import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 💡 これを足すことで、他の ArticlesModule などから Prisma を使えるようになります
})
export class PrismaModule {}
