import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class AppService {

  
constructor(private configService: ConfigService) {}

  getHello(): string {
    const appName = this.configService.get<string>('APP_NAME', 'DefaultAppName');
    log(`App Name from Config: ${appName}`);

    return 'Hello World!';
  }
}
