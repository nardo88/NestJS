import { ApiProperty } from '@nestjs/swagger'

export class SignupDTO {
  @ApiProperty({ example: 'example@mail.ru', description: 'Email' })
  readonly email: string
  @ApiProperty({ example: '********', description: 'password' })
  readonly password: string
  @ApiProperty({ example: 'Max', description: 'Имя пользователя' })
  readonly name: string
}
