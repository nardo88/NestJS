import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { BookService } from './book.service'
import { IBook } from './interfaces'
import { CreateBookDto, GetBooksQueryDto } from './dto/create-book.dto'

export class HeadersDto {
  authorization: string
}

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getList(@Query() query: GetBooksQueryDto): IBook[] {
    const page = query.page ?? 1
    const pageCount = query.pageCount ?? 2
    return this.bookService.getAll(pageCount, page)
  }

  @Get(':id')
  getOneBook(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    return res.json(this.bookService.getById(id))
  }

  @Post()
  addBook(@Body() body: CreateBookDto) {
    return this.bookService.create(body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id)
  }
}
