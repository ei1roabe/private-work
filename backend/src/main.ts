import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 ここを以下のように書き換えて、フロントからの通信を絶対に許可します
  app.enableCors({
    origin: 'http://localhost:3001', // Next.jsのURL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
