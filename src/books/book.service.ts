import { Injectable } from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { InjectModel } from '@nestjs/mongoose'
import { BookDocument, Books } from './schemas/books.schema'
import { Model } from 'mongoose'

@Injectable()
export class BookService {
  // С помощью InjectModel добавляем нашу модель и помещаем ее в переменную booksModel
  constructor(@InjectModel(Books.name) private booksModel: Model<BookDocument>) {}

  async getAll(pageCount: number, page: number): Promise<BookDocument[]> {
    return await this.booksModel
      .find()
      .skip(pageCount * (page - 1))
      .limit(pageCount)
      .lean()
  }

  async getById(id: string): Promise<BookDocument | null> {
    return await this.booksModel.findOne({ _id: id }).lean()
  }

  async create(data: CreateBookDto): Promise<BookDocument> {
    const result = await this.booksModel.create({ _id: Date.now().toString(), ...data })
    return result
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.booksModel.findOneAndDelete({ _id: id })
    return !!result
  }
}
