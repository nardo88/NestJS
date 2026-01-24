import { UsersDocument } from './../user/schemas/user.schema'
import { Controller, HttpStatus, HttpException, Post, Req } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SigninDTO } from './dto/signin.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Users } from '../user/schemas/user.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import sha256 from 'sha256'
import { AuthService } from './auth.service'
import type { Request } from 'express'
import { SignupDTO } from './dto/signup.dto'
import { createId } from 'src/helpers/createId'

@Controller()
export class AuthController {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>, // делаем инъекцию модели Users
    private auth: AuthService
  ) {}

  @Post('signin')
  @ApiOperation({ summary: 'Авторизация' })
  async signin(@Req() req: Request<Record<string, never>, object, SigninDTO>) {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim())
      throw new HttpException('Не верный логин или пароль', HttpStatus.BAD_REQUEST)

    const candidate = await this.usersModel.findOne({ 'profile.email': email.toLowerCase().trim() }).lean()

    if (!candidate) throw new HttpException('Не верный логин или пароль', HttpStatus.BAD_REQUEST)

    const isValid = await bcrypt.compare(sha256(password), candidate.services.password)
    if (!isValid) throw new HttpException('Не верный логин или пароль', HttpStatus.BAD_REQUEST)

    const { access_token, refresh_token } = await this.auth.auth(candidate._id, req)

    return { access_token, refresh_token }
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  async signup(@Req() req: Request<Record<string, never>, object, SignupDTO>) {
    const { email, password, name } = req.body

    if (!email.trim() || !password?.trim() || !name?.trim()) {
      throw new HttpException('Переданы не валидные данные', HttpStatus.BAD_REQUEST)
    }

    const candidate = await this.usersModel.findOne({ 'profile.email': email.toLowerCase().trim() }).lean()
    if (candidate)
      throw new HttpException('Пользователь с там email уже зарегистрирован в системе', HttpStatus.BAD_REQUEST)

    // Хэшируем пароль, создаем аккаунт
    const hashedPassword = await bcrypt.hash(sha256(password), 10)

    const user = await this.usersModel.create({
      _id: createId(),
      profile: {
        email: email.toLowerCase().trim(),
        name,
      },
      services: {
        password: hashedPassword,
      },
      roles: ['user'],
    })

    return { user }
  }
}
