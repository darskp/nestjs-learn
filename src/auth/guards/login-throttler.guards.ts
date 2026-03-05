import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail, ThrottlerRequest } from "@nestjs/throttler";

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
    private loginAttemps = 10;
    private ttl = 60 * 1000; //1 minute
    
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || 'unknown';
        return `login-${email}`;
    }

    protected getLimit(): Promise<number> {
        return Promise.resolve(this.loginAttemps);
    }

    protected getTtl(): Promise<number> {
        return Promise.resolve( this.ttl);
    }

    protected async throwThrottlingException() {
        throw new ThrottlerException('Too many login attempts. Please try again later.');
    }
}