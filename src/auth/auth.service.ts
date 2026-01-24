import crypto from 'crypto'
import dayjs from 'dayjs'
import { Request } from 'express'
import { UAParser } from 'ua-parser-js'

import { IAgent, TokenType } from './types'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { SessionDocument, Sessions } from './schemas/sessions.schema'
import { Model } from 'mongoose'
import { createId } from '../helpers/createId'

@Injectable()
export class AuthService {
  private access: string
  private refresh: string

  constructor(
    private jwtService: JwtService,
    @InjectModel(Sessions.name) private sessionModel: Model<SessionDocument>
  ) {
    const access = process.env.ACCESS_JWT
    const refresh = process.env.REFRESH_JWT

    if (!access || !refresh) throw new Error('Unknown secrets')

    this.access = access
    this.refresh = refresh
  }

  private parseUserAgent(req: Request): IAgent {
    const parser = new UAParser()
    const ua = parser.setUA(req.headers['user-agent'] as string).getResult()

    return {
      device: ua.device.type || 'desktop',
      os: ua.os.name || 'unknown os',
    }
  }

  private getClientIp(req: Request) {
    // Проверяем заголовки прокси (порядок важен!)
    const ip = ((req.headers['x-forwarded-for'] as string)?.split(',')?.[0] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress) as string

    // Удаляем префикс IPv6 (если есть)
    return ip?.replace(/^::ffff:/, '')
  }

  private createToken(userId: string, type: TokenType) {
    return this.jwtService.sign({ userId }, { secret: this[type], expiresIn: type === 'access' ? '5m' : '7d' })
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private async createSession(userId: string, req: Request) {
    const refresh_token = this.createToken(userId, 'refresh')
    const decoded = this.jwtService.decode(refresh_token)
    const ttl = (decoded.exp as number) * 1000
    const agent = this.parseUserAgent(req)
    const ip = this.getClientIp(req)

    await this.sessionModel.create({
      _id: createId(),
      userId,
      token: this.hashToken(refresh_token),
      ttl,
      ip,
      os: agent.os,
    })

    return ttl
  }

  async auth(userId: string, req: Request) {
    if (!userId) throw new Error('Unknown user')
    const refresh_token = this.createToken(userId, 'refresh')
    const ttl = await this.createSession(userId, req)

    return {
      access_token: this.createToken(userId, 'access'),
      refresh_token,
      ttl,
    }
  }

  async refreshToken(req: Request) {
    try {
      const authorization = req.headers.authorization?.split(' ')
      if (!authorization) return { status: 'error' }

      const [type, token] = authorization
      if (type !== 'Bearer') return { status: 'error' }
      if (!token) return { status: 'error' }

      const { userId } = this.jwtService.verify(token, { secret: this.refresh }) as { userId: string }
      const hash = this.hashToken(token)

      const session = await this.sessionModel.findOne({ userId, token: hash })
      if (!session) return { status: 'error' }

      // Если ttl сессии истек возвращаем 403
      if (dayjs().isAfter(dayjs(session.ttl))) {
        await session.deleteOne()
        return { status: 'error' }
      }

      const refresh_token = this.createToken(userId, 'refresh')

      const newDecoded = this.jwtService.decode(token)
      const ttl = (newDecoded.exp as number) * 1000

      await this.sessionModel.findOneAndUpdate({ _id: session._id }, { token: this.hashToken(refresh_token), ttl })

      return {
        status: 'success',
        access_token: this.createToken(userId, 'access'),
        refresh_token,
        ttl,
      }
    } catch (_e) {
      return { status: 'error' }
    }
  }

  async logout(req: Request) {
    const authorization = req.headers.authorization?.split(' ')
    if (!authorization) return
    const [type, token] = authorization

    if (type !== 'Bearer') return

    const decoded = this.jwtService.verify(token, { secret: this.refresh }) as { userId: string }
    const hash = this.hashToken(token)

    await this.sessionModel.findOneAndDelete({ userId: decoded.userId, token: hash })
  }
}
