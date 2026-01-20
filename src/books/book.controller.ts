import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { BookService } from './book.service'
import { CreateBookDto, GetBooksQueryDto } from './dto/create-book.dto'
import { BookDocument, Books } from './schemas/books.schema'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

export class HeadersDto {
  authorization: string
}

@ApiTags('Книги')
@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Получение списка книг' })
  @ApiResponse({ status: 200, type: [Books] })
  @Get()
  async getList(@Query() query: GetBooksQueryDto): Promise<BookDocument[]> {
    const page = query.page ?? 1
    const pageCount = query.pageCount ?? 2
    return await this.bookService.getAll(pageCount, page)
  }

  @ApiOperation({ summary: 'Получение книги по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID книги',
    example: '507f1f77bcf86cd',
    required: true,
  })
  @ApiResponse({ status: 200, type: Books })
  @ApiResponse({
    // Описание 404 статуса
    status: 404,
    description: 'Книга не найдена',
  })
  @Get(':id')
  async getOneBook(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    const data = await this.bookService.getById(id)
    if (!data) res.sendStatus(404)
    return res.json(data)
  }

  @ApiOperation({ summary: 'Создание книги' })
  @ApiResponse({ status: 201, type: Books })
  @Post()
  addBook(@Body() body: CreateBookDto) {
    return this.bookService.create(body)
  }

  @ApiOperation({ summary: 'Удаление книги' })
  @ApiResponse({ status: 201, type: Boolean })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id)
  }
}
