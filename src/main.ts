import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);
  const port = configService.appConfig.port;

  await app.listen(port, '0.0.0.0', async () => {
    console.info(`\u{1F680} Server started successfully!`);
    console.info(`\u{1F680} Application is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
