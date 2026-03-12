import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

let cachedApp: INestApplication;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Always return a JSON response, never an empty 500
    app.useGlobalFilters(new AllExceptionsFilter());

    // Enable global validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Configure Swagger
    const config = new DocumentBuilder()
      .setTitle('MCOMLINKS API')
      .setDescription('The MCOMLINKS Backend API for Rotator and Management Platform')
      .setVersion('1.0')
      .addTag('Authentication')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(app => {
    const port = process.env.PORT ?? 3000;
    app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api`);
  });
}

// For Vercel
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};
