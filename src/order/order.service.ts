import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderService {
	constructor(private readonly userService: UserService) {}

    getdummyOrdersData(): any[] {
        return [
            { id: 1, item: 'Laptop', userId: 1 },
            { id: 2, item: 'Phone', userId: 2 },
        ];
    }

	getOrderWithUser(orderId: number) {
        const orders = this.getdummyOrdersData();
        const order = orders.find(order => order.id === orderId);
		const user = this.userService.getUserById(order.userId);
		return { ...order, user };
	}
}
