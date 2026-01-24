import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { Sessions, SessionSchema } from './schemas/sessions.schema'
import { UsersModule } from '../user/user.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [UsersModule, MongooseModule.forFeature([{ name: Sessions.name, schema: SessionSchema }])],
})
export class AuthModule {}
