import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET!
        })
    }

    async validate(payload: any) {
            try {
                const user = await this.authService.validateUser(payload.sub);
                if (!user) {
                    throw new UnauthorizedException('User not found');
                }
                return{
                    ...user,
                    role: payload.role
                }
            } catch (err) {
                throw new UnauthorizedException('Invalid token');
            }
        }
    }