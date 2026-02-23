import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    constructor (private readonly HelloService:HelloService){}

    getAllUsersData(): any[]{
        return[
            {id:1, name:'John1'},
            {id:2, name:'Jane2'},
            {id:3, name:'Jane3'},
        ]
    }

    getUserById(id:number):any{
        const users = this.getAllUsersData();
        return users.find(user => user.id === id);
    }

    getWelcomeMessageForUser(userId:number):string{
        const user = this.getUserById(userId);
        if(user){
            return this.HelloService.getHelloWithName(user.name);
        } else {
            return 'User not found';
        }
    }
}
