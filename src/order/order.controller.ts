import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get(':id')
	getOrderWithUser(@Param('id', ParseIntPipe) id: number) {
		return this.orderService.getOrderWithUser(id);
	}
}
