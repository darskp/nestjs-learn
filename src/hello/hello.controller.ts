import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
// The HelloController handles incoming requests to the /hello route and its sub-routes

export class HelloController {
    //constructor injection of HelloService to use its methods in the controller
    constructor(private readonly helloService: HelloService) {}

    // http://localhost:3000/hello/first-route - returns a simple greeting
    //example: /hello/first-route - returns "Hello from HelloService!"
    @Get('first-route')
    getHello():String{
        return this.helloService.getHello();
    }
    
    // /hello/user/:name - returns a personalized greeting using a route parameter
    //example: /hello/user/John - returns "Hello, John! Welcome to NestJS!"
    @Get('/user/:name')
    getHelloWithName(@Param('name') name: string): string {
        return this.helloService.getHelloWithName(name);
    }
    
    // /hello/query?name=YourName - returns a personalized greeting using a query parameter
    //example: /hello/query?name=John - returns "Hello, John! Welcome to NestJS!" or
    //example: /hello/query - returns "Hello, Guest! Welcome to NestJS!" if no name is provided
    //search or filter functionality on the FE
    @Get('query')
    getHelloWithQuery(@Query('name') name:string): string {
        return this.helloService.getHelloWithName(name || 'Guest');
    }
}
