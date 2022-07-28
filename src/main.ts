import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  await app.listen(3000, '0.0.0.0', async () => {
    console.info(`\u{1F680} Server started successfully!`)
    console.info(`\u{1F680} Application is running on: ${await app.getUrl()}`)
  });

 
}
bootstrap();
