import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type BookDocument = Books & Document

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Books {
  @Prop({})
  _id: string

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

  @Prop({
    min: 10, // минимальное значение для чисел
    max: 100, // максимальное значение для чисел
  })
  price: number

  @Prop({
    ref: 'Users', // Ссылочное поле на другую коллекцию
  })
  authorID: string

  @Prop({ type: Number })
  createdAt: number

  @Prop({ type: Number })
  updatedAt: number
}

export const BooksSchema = SchemaFactory.createForClass(Books)
