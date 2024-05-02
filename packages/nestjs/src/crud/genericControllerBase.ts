import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GenericServiceBase } from './genericServiceBase';

/**
 * This class provides a base controller for the CRUD operations.
 * @param T The type of the entity.
 * @param {GenericServiceBase} service The service that will be used to perform the CRUD operations.
 */
export class GenericControllerBase<T> {
  constructor(protected service: GenericServiceBase<T>) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() ...body: any): Promise<any> {
    return this.service.create(body[0]);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  find(@Query() ..._: any): Promise<any> {
    return this.service.find();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<any> {
    return this.service.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() body: Partial<T>): Promise<any> {
    return this.service.updateOne(id, body as any);
  }
}
