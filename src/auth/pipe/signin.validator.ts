// validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { SignupDTO } from '../dto/signup.dto'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<SignupDTO> {
    // Проверяем, что это DTO для валидации
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value as SignupDTO
    }

    // Преобразуем объект в экземпляр класса DTO
    const object = plainToInstance(metadata.metatype, value) as SignupDTO

    // Валидируем объект
    const errors = await validate(object)

    if (errors.length > 0) {
      // Форматируем ошибки для красивого вывода
      const formattedErrors = this.formatErrors(errors)
      throw new BadRequestException({
        message: 'Ошибка валидации',
        errors: formattedErrors,
      })
    }

    return object
  }

  private formatErrors(errors: any[]): string[] {
    return errors.map((error) => {
      const constraints = Object.values(error.constraints || {})
      return `${error.property}: ${constraints.join(', ')}`
    })
  }

  private toValidate(type: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(type)
  }
}
