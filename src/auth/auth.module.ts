import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import { RolesGuard } from './guards/roles-guard';

@Module({
   imports: [
          //available for dependency injection in the service and controller
          TypeOrmModule.forFeature([User]),
          PassportModule,
          JwtModule.register({})
      ],
  providers: [AuthService,JwtStrategy,RolesGuard],
  controllers: [AuthController],
  exports: [AuthService,RolesGuard]
})
export class AuthModule {}
