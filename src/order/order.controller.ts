import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IdParams } from 'src/typings';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiCreatedResponse({
    type: Order,
  })
  create(@Body() orderData: CreateOrderDto): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOkResponse({
    type: Order,
  })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  findOne(@Param() params: IdParams): Promise<Order> {
    return this.orderService.findOne(params.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    type: [Order],
  })
  @ApiUnauthorizedResponse()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }
}
