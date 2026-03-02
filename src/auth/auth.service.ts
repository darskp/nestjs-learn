import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
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
        const user = await this.userRepository.findOneBy({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials or account does not exist');
        }
        // const tokens = await this.generateTokens(user);
        const { password: _, ...result } = user;
        return {
            user: result,
            ...tokens,
            message: 'Login successful! Welcome back.'
        }
    }


    private async hashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

}
