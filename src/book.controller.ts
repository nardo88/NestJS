import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import type { Request, Response } from 'express'

interface IBook {
  _id: string
  title: string
  cost: number
}

export class GetBooksQueryDto {
  page?: number
  pageCount?: number
}

export class HeadersDto {
  authorization: string
}

const data: IBook[] = [{ _id: '1', title: 'Example', cost: 5000 }]

@Controller('books')
export class BooksController {
  constructor() {}

  @Get()
  @Header('Custom-Header', '5')
  getList(@Query() query: GetBooksQueryDto): IBook[] {
    const page = query.page ?? 1
    const pageCount = query.pageCount ?? 2

    return [...data].splice(pageCount * (page - 1), pageCount)
  }

  @Get(':id')
  getOneBook(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params
    const current = data.find((i) => i._id === id)
    if (!current) return res.sendStatus(HttpStatus.NOT_FOUND)
    res.status(HttpStatus.OK)
    return current
  }

  @Post()
  addBook(@Body() body: Pick<IBook, 'cost' | 'title'>) {
    const newBook: IBook = { _id: Date.now().toString(), ...body }
    data.push(newBook)
    return newBook
  }

  @Delete(':id')
  remove() {}

  @Put(':id')
  @HttpCode(200) // по умолчанию
  update(@Param() params: { id: string }) {
    const id = params.id

    if (id !== '123') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN) // 403
    }

    return { id }
  }
}
