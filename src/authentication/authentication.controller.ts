import { Body, ClassSerializerInterceptor, Controller, HttpCode, Inject, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { IAUTHENTICATION_SERVICE } from '../constants/services.constant';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AccessTokenDto } from './dto/accessToken.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('authentication')
export class AuthenticationController {

  constructor(
    @Inject(IAUTHENTICATION_SERVICE) private authenticationService: IAuthenticationService,
  ) {
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() createUserData: CreateUserDto): Promise<User> {
    return this.authenticationService.register(createUserData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<AccessTokenDto> {
    return this.authenticationService.login(request.user);
  }
  
  // @Get()
  // @UseGuards(JwtAuthenticationGuard)
  // async findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }
}
