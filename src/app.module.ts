import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BooksController } from './book.controller'

@Module({
  imports: [],
  controllers: [AppController, BooksController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
