import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(Config);

  await app.listen(3000);
}
bootstrap();
