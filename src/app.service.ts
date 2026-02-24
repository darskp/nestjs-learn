import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class AppService {

  
constructor(private configService: ConfigService) {}

  getHello(): string {
    const appName = this.configService.get<string>('APP_NAME', 'DefaultAppName');
    log(`App Name from Config and validation using the joi: ${appName}`);

    return `Hello World! ${appName}`;
  }
}
