import { Injectable } from '@nestjs/common'
import { IBook } from './interfaces'
import { CreateBookDto } from './dto/create-book.dto'

@Injectable()
export class BookService {
  private readonly books: IBook[] = []

  getAll(pageCount: number, page: number) {
    return [...this.books].splice(pageCount * (page - 1), pageCount)
  }

  getById(id: string) {
    return this.books.find((i) => i._id === id)
  }

  create(data: CreateBookDto) {
    const newBook: IBook = { ...data, _id: Date.now().toString() }
    this.books.push(newBook)
    return newBook
  }

  remove(id: string) {
    const index = this.books.findIndex((i) => i._id === id)
    if (index !== -1) {
      this.books.splice(index, 1)
      return true
    }
    return false
  }
}
