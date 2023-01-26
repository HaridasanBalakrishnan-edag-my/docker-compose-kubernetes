import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { createLightship } from 'lightship';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { json } from 'body-parser';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const lightship = createLightship();
  lightship.registerShutdownHandler(() => {
    setTimeout(() => {
      app.close().catch(err => {
        Logger.error(err);
      });
    }, Number(configService.getNumber('SHUTDOWN_DELAY')) || 10000);
  });

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true, bodyParser: true },
  );

  app.use(json({ limit: '50mb' }));

  const configService = app.select(SharedModule).get(ConfigService);

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new HttpExceptionFilter(reflector));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs Monolitic Rest API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);

  const port = configService.getNumber('PORT');
  await app.listen(port, () => {
    lightship.signalReady();
  });

  Logger.log(`Server running on http://localhost:${port}`, 'bootstrap');
}

bootstrap();
