import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Security
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    // CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
    });

    // Global validation pipe
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

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Civic & Nonprofit Platform API')
        .setDescription('API for civic engagement and nonprofit management')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('nonprofits', 'Nonprofit organization management')
        .addTag('campaigns', 'Fundraising campaigns')
        .addTag('donations', 'Payment and donation processing')
        .addTag('volunteering', 'Volunteer opportunities')
        .addTag('events', 'Community events')
        .addTag('petitions', 'Civic petitions')
        .addTag('impact', 'Impact tracking')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Civic Platform API running on http://localhost:${port}`);
    console.log(`📖 API Documentation: http://localhost:${port}/api`);
}
bootstrap();
