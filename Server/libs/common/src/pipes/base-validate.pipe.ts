import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiException } from '../Exceptions/ApiException'

@Injectable()
export class BaseValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      // 获取第一个异常
      let error = errors.shift()
      const { contexts, constraints } = error
      console.log(contexts, constraints, '===')
      for (let key in constraints) {
        console.log(constraints[key], contexts[key])
        throw new BadRequestException(new ApiException(constraints[key], HttpStatus.BAD_REQUEST));
      }
      // throw new BadRequestException('Validation failed 123123123');
    }
    // return value;
    return object; // 转换的值
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}