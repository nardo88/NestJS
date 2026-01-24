import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema({
  versionKey: false,
  _id: false,
})
export class UserProfile {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Prop({ required: true })
  name: string

  @ApiProperty({ example: 'example@mail.ru', description: 'Email пользователя' })
  @Prop({ required: true, unique: true })
  email: string
}
