// /src/app.module.ts

import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { BookModule } from './books/books.module'
import 'dotenv/config'
import { AuthModule } from './auth/auth.module'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nest'

@Module({
  imports: [
    BookModule,
    AuthModule,
    MongooseModule.forRoot(MONGO_URL), //ДОбавили импорт MongooseModule
  ],
  exports: [],
})
export class AppModule {}
