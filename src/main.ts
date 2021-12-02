import { NestFactory } from '@nestjs/core';
import { GameModule } from './game/game.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(GameModule);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap();
