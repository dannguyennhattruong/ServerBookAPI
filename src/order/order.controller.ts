import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Users } from '../utilities/user.decorator';
import { User as UserDocument } from '../types/user';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listOrders(@Users() { id }: UserDocument) {
    return this.orderService.listOrdersByUser(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() order: CreateOrderDTO, @Users() { id }: UserDocument) {
    return this.orderService.createOrder(order, id);
  }
}
