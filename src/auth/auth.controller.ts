import { Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

@Controller()
export class AuthController {
  @Post('signin')
  @ApiOperation({ summary: 'Авторизация' })
  signin() {}
}
