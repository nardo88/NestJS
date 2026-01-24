import { ApiProperty } from '@nestjs/swagger'

export class SigninDTO {
  @ApiProperty({ example: 'example@mail.ru', description: 'Email' })
  readonly email: string
  @ApiProperty({ example: '********', description: 'password' })
  readonly password: number
}
