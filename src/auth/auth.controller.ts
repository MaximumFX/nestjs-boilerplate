import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { User } from '../users/domain/user';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { Authenticated, Protected, Public } from './auth.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { AuthenticatedUser } from '../utils/decorators/authenticated-user.decorator';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('Auth')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @Public()
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.service.validateLogin(loginDto);
  }

  @Post('email/register')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.service.register(createUserDto);
  }

  @Post('email/confirm')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('email/confirm/new')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmNewEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmNewEmail(confirmEmailDto.hash);
  }

  @Post('forgot/password')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Authenticated()
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  public me(@CurrentUser() user: JwtPayloadType): Promise<NullableType<User>> {
    return this.service.me(user);
  }

  @Protected()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @CurrentUser() user: JwtRefreshPayloadType,
  ): Promise<RefreshResponseDto> {
    return this.service.refreshToken({
      sessionId: user.sessionId,
      hash: user.hash,
    });
  }

  @Authenticated()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@CurrentUser() user: JwtPayloadType): Promise<void> {
    await this.service.logout({
      sessionId: user.sessionId,
    });
  }

  @Authenticated()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  public async update(
    @Body() userDto: AuthUpdateDto,
    @CurrentUser() currentUser: JwtPayloadType,
    @AuthenticatedUser() user: User,
  ): Promise<NullableType<User>> {
    return await this.service.update(currentUser, user, userDto);
  }

  @Authenticated()
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@AuthenticatedUser() user: User): Promise<void> {
    return this.service.softDelete(user);
  }
}
