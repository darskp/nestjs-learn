import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAllUsers(): any[] {
        return this.userService.getAllUsersData();
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number): any {
        return this.userService.getUserById(id);
    }

    @Get(':id/welcome')
    getWelcomeMessageForUser(@Param('id', ParseIntPipe) id: number): string {
        return this.userService.getWelcomeMessageForUser(id);
    }

}
