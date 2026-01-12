// /src/books/books.module

import { Module } from '@nestjs/common'
import { BooksController } from './book.controller'
import { BookService } from './book.service'

@Module({
  controllers: [BooksController],
  providers: [BookService],
})
export class BookModule {}
