import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'account/account.service';
import { CreateAccountDto } from 'account/dto/create-account.dto';
import { Ac3AttenuationControl } from 'aws-sdk/clients/medialive';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'user/dto/create-user.dto';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private accountService: AccountService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.accountService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await this.accountService.create(email, hashedPassword);

    const payload = { username: newUser.email, sub: newUser.id };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1w',
    });
    return { access_token };
  }

  async login(email: string, password: string) {
    const account = await this.accountService.findByEmail(email);
    if (!account || !(await bcrypt.compare(password, account.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: account.id, username: account.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      account: account
    };
  }
}
