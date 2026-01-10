import { NestFactory } from '@nestjs/core'
import dotenv from 'dotenv'
import { AppModule } from './app.module'
dotenv.config()

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  app.setGlobalPrefix('/api/v1') // Добавили глобальный префикс

  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
  })
}

bootstrap()
