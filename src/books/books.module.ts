// /src/books/books.module

import { Module } from '@nestjs/common'
import { BooksController } from './book.controller'
import { BookService } from './book.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Books, BooksSchema } from './schemas/books.schema'

@Module({
  controllers: [BooksController],
  providers: [BookService],
  // Импорт MongoDB
  imports: [
    MongooseModule.forFeature([
      // Передаем список коллекций которые могут быть доступны в модуле
      { name: Books.name, schema: BooksSchema }, // Название и схема коллекции
    ]),
  ],
})
export class BookModule {}
