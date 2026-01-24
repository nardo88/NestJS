import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { Sessions, SessionSchema } from './schemas/sessions.schema'
import { UsersModule } from '../user/user.module'
import { JWTAuthGuard } from './guards/jwt.auth.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JWTAuthGuard],
  imports: [
    UsersModule, // Импортируем модуль с пользователями
    MongooseModule.forFeature([{ name: Sessions.name, schema: SessionSchema }]),
  ],
  exports: [JWTAuthGuard],
})
export class AuthModule {}
