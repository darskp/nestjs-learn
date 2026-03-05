import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async registerUser(registerData: RegisterDto) {
        const existingUser = await this.userRepository.findOneBy({ email: registerData.email });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const newUser = this.userRepository.create({
            email: registerData.email,
            name: registerData.name,
            password: await this.hashedPassword(registerData.password),
            role: UserRole.USER
        });
        const savedUser = await this.userRepository.save(newUser);
        const { password, ...result } = savedUser;
        return {
            user: result,
            message: 'User registered successfully! Log in to access your account.'
        }
    }

    async createAdmin(adminData: RegisterDto) {
        const existingUser = await this.userRepository.findOneBy({ email: adminData.email });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const newAdmin = this.userRepository.create({
            email: adminData.email,
            name: adminData.name,
            password: await this.hashedPassword(adminData.password),
            role: UserRole.ADMIN
        });
        const savedAdminData = await this.userRepository.save(newAdmin);
        const { password, ...result } = savedAdminData;
        return {
            user: result,
            message: 'Admin registered successfully! Log in to access your account.'
        }
    }

    async loginUser(email: string, password: string) {
        // const user = await this.userRepository.findOneBy({ email });
        const user = await this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.email = :email", { email })
        .getOne();
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials or account does not exist');
        }

        const tokens = await this.generateTokens(user);
        const { password: _, ...result } = user;
        return {
            user: result,
            ...tokens,
            message: 'Login successful! Welcome back.'
        }
    }
    private async generateTokens(user: User) {
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    private async generateAccessToken(user: User): Promise<string> {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '15m'
        });
        return accessToken;
    }

    private async generateRefreshToken(user: User): Promise<string> {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const refreshToken= await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d'
        });
        return refreshToken;
    }

    async refreshToken(token:string) {
        try {
            const payload = await this.jwtService.verify(token, { secret: process.env.REFRESH_TOKEN_SECRET });
            const user = await this.userRepository.findOneBy({ id: payload.sub });
            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            return {
                accessToken: await this.generateAccessToken(user),
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateUser(userId: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }

    private async hashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

}
