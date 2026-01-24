import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type SessionDocument = Sessions & Document

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Sessions {
  @ApiProperty({ example: 'psjbdDNn9krZ8ihHa', description: 'Уникальный идентификатор' })
  @Prop({ unique: true })
  _id: string

  @ApiProperty({ example: 'psjbdDNn9krZ8ihHa', description: 'ID пользователя' })
  @Prop({ required: true, ref: 'Users' })
  userId: string

  @ApiProperty({
    example: '0d339e064a908dfca72e0fa06f49e7a9ce465a5c3e1aba808f7e49df9cf45586',
    description: 'Hash токена',
  })
  @Prop({ required: true })
  token: string

  @ApiProperty({ example: 1769170393582, description: 'TTL сессии' })
  @Prop({ required: true })
  ttl: number

  @ApiProperty({ example: '192.168.12.1', description: 'IP адрес' })
  @Prop({})
  ip: string

  @ApiProperty({ example: 'Ubuntu', description: 'Операционная система' })
  @Prop({})
  os: string

  @ApiProperty({ example: 1710828603393, description: 'Дата создания' })
  @Prop({ type: Number })
  createdAt: number

  @ApiProperty({ example: 1710828603393, description: 'Дата Обновления' })
  @Prop({ type: Number })
  updatedAt: number
}

export const SessionSchema = SchemaFactory.createForClass(Sessions)
