import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
} from 'src/auth/dtos';
import { AuthTokenInterface } from 'src/auth/interfaces';
import { IsAuthorizedGuard } from 'src/auth/guards';
import { UserRoleEnum } from 'src/user/enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/admin/register')
  adminRegister(@Body() body: AuthRegisterDto): Promise<AuthTokenInterface> {
    return this.authService.register(body);
  }

  @UseGuards(new IsAuthorizedGuard([UserRoleEnum.SUPER_ADMIN]))
  @Post('/user/register')
  userRegister(@Body() body: AuthRegisterDto): Promise<AuthTokenInterface> {
    return this.authService.register(body);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  updatePassword(@Body() body: AuthResetPasswordDto): Promise<string> {
    return this.authService.resetPassword(body);
  }

  @Post('/login')
  login(@Body() body: AuthLoginDto): Promise<AuthTokenInterface> {
    return this.authService.login(body);
  }
}
