import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Public } from 'common/decorators/public.decorator';
import { AuthGuard } from 'auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findOne(@Req() req: any) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }        
    return await this.accountService.findOne(user.sub);
  }

  @Public()
  @Post('accountByUrl')
  async accountByUrl(@Body() data: { accountUrl: string }) {
    return await this.accountService.findPartialOneByUrl(data.accountUrl);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Put('')
  @UseInterceptors(FileInterceptor('headImg'))
  async updateAccount(
    @Body() updateAccountDto: CreateAccountDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Account> {
    const accountId = req.user.sub;
    console.log(file, 'file controller');
    return this.accountService.update(accountId, updateAccountDto, file);
  }
}
