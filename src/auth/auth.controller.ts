import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as UserEntity, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorators';
import { RolesGuard } from './guards/roles-guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async userRegister(
        @Body() registerData: RegisterDto
    ): Promise<{ user: Omit<UserEntity, 'password'>; message: string }> {
        return this.authService.registerUser(registerData);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async userLogin(
        @Body() data: LoginDto
    ): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: Omit<UserEntity, 'password'>
    }> {
        return this.authService.loginUser(data.email, data.password);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Body() token: { refreshToken: string }
    ) {
        return this.authService.refreshToken(token.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    getProfile(@CurrentUser() user: UserEntity) {
        return user;
    }

    @Post('create-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    createAdmin(@Body() registerData: RegisterDto) {
        return this.authService.createAdmin(registerData);
    }


}
