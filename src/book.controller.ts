import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { BookService, IBook } from './book.service'

export class GetBooksQueryDto {
  page?: number
  pageCount?: number
}

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
  addBook(@Body() body: Pick<IBook, 'cost' | 'title'>) {
    return this.bookService.create(body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.delete(id)
  }
}
