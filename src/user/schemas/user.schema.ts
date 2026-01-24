import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'
import { UserProfile } from './profile.schema'

export type UsersDocument = Users & Document

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Users {
  @ApiProperty({ example: 'psjbdDNn9krZ8ihHa', description: 'Уникальный идентификатор' })
  @Prop({})
  _id: string

  @ApiProperty({
    description: 'Профиль пользователя',
    type: UserProfile,
  })
  @Prop({ type: UserProfile })
  profile: UserProfile

  @Prop({
    _id: false,
    type: {
      password: {
        type: String,
        require: true,
      },
    },
  })
  services: {
    password: string
  }

  @ApiProperty({
    description: 'Роли пользователя',
    type: [String],
  })
  @Prop({ type: [String], default: ['user'] })
  roles: string[]

  @ApiProperty({
    description: 'Дата создания пользователя в unix',
    example: 1718951425162,
    type: Number,
  })
  createdAt: number

  @ApiProperty({
    description: 'Дата обновления пользователя в unix',
    example: 1718951425162,
    type: Number,
  })
  updatedAt: number
}

export const UsersSchema = SchemaFactory.createForClass(Users)

UsersSchema.path('createdAt', Number)
UsersSchema.path('updatedAt', Number)

// и говорим, как генерировать время
UsersSchema.set('timestamps', {
  currentTime: () => Date.now(),
})
