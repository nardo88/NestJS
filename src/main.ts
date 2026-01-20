import { NestFactory } from '@nestjs/core'
import dotenv from 'dotenv'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
dotenv.config()

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  app.setGlobalPrefix('/api/v1')

  const config = new DocumentBuilder() //  Паттерн строитель для конфига swagger
    .setTitle('NestJS REST API') // Название приложение
    .setDescription('Rest API description for example') // Описание приложения
    .setVersion('1.0.0') // Указываем версию приложения
    .addTag('Tag for example') //Теги при необходимости
    .build() //Как завершающая стадия - сборка конфига

  // Создаем документ Swagger
  const document = SwaggerModule.createDocument(app, config)
  // На основании документа создаем setup swagger
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
  })
}

bootstrap()
