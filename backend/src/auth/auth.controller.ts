import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'user/dto/create-user.dto';
import { CreateAccountDto } from 'account/dto/create-account.dto';
import { Public } from 'common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const { email, password } = loginData;
    return this.authService.login(email, password);
  }

  @Public()
  @Post('register')
  async register(@Body() loginData: { email: string; password: string }) {
    const { email, password } = loginData;
    return await this.authService.register(email, password);
  }
}
