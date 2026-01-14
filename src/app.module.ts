// /src/app.module.ts

import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BookModule } from './books/books.module'
import { CatsModule } from './cats/cats.module'
import 'dotenv/config'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nest'

@Module({
  imports: [
    BookModule,
    CatsModule,
    MongooseModule.forRoot(MONGO_URL), //ДОбавили импорт MongooseModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
