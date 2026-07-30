import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // アプリ起動時にデータベースに接続する
  async onModuleInit() {
    await this.$connect();
  }
}
