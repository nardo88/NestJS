import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import 'dotenv/config'

const ACCESS_JWT = process.env.ACCESS_JWT

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()

    try {
      const authorization = req.headers.authorization
      const bearer = authorization?.split(' ')?.[0]
      const token = authorization?.split(' ')?.[1]

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
      }

      const user = this.jwt.verify(token, { secret: ACCESS_JWT })

      req.user = user
      return true
    } catch (e) {
      console.log('e: ', e)
      throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
    }
  }
}
