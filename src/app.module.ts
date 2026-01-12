// /src/app.module.ts

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BookModule } from './books/books.module'
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [BookModule, CatsModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
