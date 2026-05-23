import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import './shared/infrastructure/env/env';

import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Prescription APP - API Documentation')
    .setDescription(
      'API documentation for the Prescription APP. This documentation provides details about the available endpoints, request and response formats, and authentication requirements for the Prescription APP API.',
    )
    .setVersion('1.0')
    .setExternalDoc('GitHub - Repository', 'https://github.com/OscarS05/prescription-app')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.enableCors({
    origin: '*',
  });
  app.use(cookieParser());
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
