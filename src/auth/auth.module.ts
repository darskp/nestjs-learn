import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
          //available for dependency injection in the service and controller
          TypeOrmModule.forFeature([User])
      ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
