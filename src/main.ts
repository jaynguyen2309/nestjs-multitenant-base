import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * NOTES: API prefix example: my-api.com/api/users
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  await app.listen(AppModule.port);
}
bootstrap();
