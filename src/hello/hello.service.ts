import { Injectable } from '@nestjs/common';

@Injectable()

export class HelloService {
    // This method returns a simple greeting message
    getHello(): string {
        return 'Hello from HelloService!';
    }

    // This method takes a name as a parameter and returns a personalized greeting message
    getHelloWithName(name: string): string {
        return `Hello, ${name}! Welcome to NestJS!`;
    }
}
