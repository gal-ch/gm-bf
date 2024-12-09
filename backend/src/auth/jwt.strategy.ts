import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private jwtSecret: string;
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Access secret via ConfigService
    });

    this.jwtSecret = configService.get<string>('JWT_SECRET'); // Assign it to a class property
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}