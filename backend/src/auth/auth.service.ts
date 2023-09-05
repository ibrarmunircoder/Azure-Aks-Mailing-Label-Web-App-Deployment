import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
} from 'src/auth/dtos';
import { UserEntity } from 'src/user/entities';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { JwtSignOptions, JwtService } from '@nestjs/jwt';
import { AuthTokenInterface } from 'src/auth/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(payload: AuthRegisterDto): Promise<AuthTokenInterface> {
    const isEmailTaken = await this.userService.findByEmail(payload.email);

    if (isEmailTaken) {
      throw new BadRequestException(
        'the user with this email is already exist!',
      );
    }
    const user = await this.userService.create({
      ...payload,
    });
    const accessToken = await this.createAccessToken(user);
    return { access_token: accessToken };
  }

  public async login(payload: AuthLoginDto): Promise<AuthTokenInterface> {
    const { email, password } = payload;

    if (!email || !password) {
      throw new BadRequestException('Please provide email and password!');
    }

    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.compareData(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (!user.active) {
      throw new UnauthorizedException('User is inactive');
    }
    const accessToken = await this.createAccessToken(user);
    return { access_token: accessToken };
  }

  public async resetPassword(payload: AuthResetPasswordDto) {
    const userEntity = await this.userService.findByEmail(payload.email);
    if (!userEntity) {
      throw new NotFoundException(
        `There is no user with this email ${payload.email} address.`,
      );
    }
    const newPassword = await this.hashData(payload.password);
    userEntity.password = newPassword;
    await this.userService.update(userEntity.id, { password: newPassword });
    return 'Your password has been changed';
  }

  public createAccessToken(user: UserEntity): Promise<string> {
    const { secret, expiresIn } = this.appConfig.jwt.access;
    const options: JwtSignOptions = { secret, expiresIn };
    return this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      options,
    );
  }

  public hashData(password: string) {
    return bcrypt.hash(password, 10);
  }

  public compareData(attempt: string, password: string) {
    return bcrypt.compare(attempt, password);
  }
}
