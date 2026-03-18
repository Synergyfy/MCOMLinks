import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
  INestApplication,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// 1. Shared Configuration Function
export function configureApp(app: INestApplication) {
  // Normalization: collapse multiple slashes (e.g. //auth/login -> /auth/login)
  app.use((req: any, res: any, next: any) => {
    if (req.url && req.url.includes('//')) {
      req.url = req.url.replace(/\/\/+/g, '/');
    }
    next();
  });

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });



  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Serialization
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('MCOMLINKS API')
    .setDescription('The MCOMLINKS Backend API for Rotator and Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customfavIcon:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/favicon-16x16.png',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

// 2. Local Development Bootstrap
if (require.main === module) {
  const bootstrap = async () => {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    configureApp(app);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation: http://localhost:${port}/api-docs`);
  };
  void bootstrap();
}

// 3. Vercel Serverless Handler
let cachedApp: any;

export default async (req: unknown, res: unknown) => {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance() as unknown;
  }
  return (cachedApp as (req: unknown, res: unknown) => Promise<unknown>)(
    req,
    res,
  );
};