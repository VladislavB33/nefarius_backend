import { NestFactory } from '@nestjs/core';
import { GameModule } from './game/game.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(GameModule);

  const config = new DocumentBuilder()
    .setTitle('Nefarius')
    .setDescription('Docs REST API')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap();
