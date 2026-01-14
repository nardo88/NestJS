import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { BookService } from './book.service'
import { CreateBookDto, GetBooksQueryDto } from './dto/create-book.dto'
import { BookDocument } from './schemas/books.schema'

export class HeadersDto {
  authorization: string
}

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getList(@Query() query: GetBooksQueryDto): Promise<BookDocument[]> {
    const page = query.page ?? 1
    const pageCount = query.pageCount ?? 2
    return await this.bookService.getAll(pageCount, page)
  }

  @Get(':id')
  async getOneBook(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    const data = await this.bookService.getById(id)
    if (!data) res.sendStatus(404)
    return res.json(data)
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
