import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type BookDocument = Books & Document

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Books {
  @ApiProperty({ example: 'psjbdDNn9krZ8ihHa', description: 'Уникальный идентификатор' })
  @Prop({})
  _id: string

  @ApiProperty({ example: 'Война и мир', description: 'Название книги' })
  @Prop({
    required: true, // поле обязательно
    default: 'For example', // значение по умолчанию
    unique: false, // уникальное значение
    index: true, // поле является индексом
    minLength: 5, // ограничение по длине для строк
    maxLength: 100, // ограничение по длине для строк
    lowercase: true, // нижний регистр
    uppercase: true, // верхний регистр
    trim: true, // обрезает пробелы по сторонам
    select: true, // false -исключение при выборке, т.е. поле будет отсутствовать при поиске
    immutable: true, // неизменяемое поле
    expires: 3600, // TTL индекс (для автоматического удаления в секундах)
    validate: {
      message: 'title is not valid', // Сообщение при ошибке валидации
      // Функция валидации
      validator: (value: string) => {
        return typeof value === 'string'
      },
    },
  })
  title: string

  @ApiProperty({ example: 50, description: 'Цена книги' })
  @Prop({
    min: 10, // минимальное значение для чисел
    max: 100, // максимальное значение для чисел
  })
  price: number

  @ApiProperty({ example: 'BoDxssiCGrRWpuERn', description: 'Ссылка на автора' })
  @Prop({
    ref: 'Users', // Ссылочное поле на другую коллекцию
  })
  authorID: string

  @ApiProperty({ example: 1710828603393, description: 'Дата создания' })
  @Prop({ type: Number })
  createdAt: number

  @ApiProperty({ example: 1710828603393, description: 'Дата Обновления' })
  @Prop({ type: Number })
  updatedAt: number
}

export const BooksSchema = SchemaFactory.createForClass(Books)
