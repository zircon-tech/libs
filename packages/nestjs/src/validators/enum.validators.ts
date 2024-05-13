import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEnumList', async: false })
export class IsEnumList implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const enums: Record<string, any>[] = args.constraints;
    const values = text.split(',').filter(value => value && value != '');

    return (
      values.filter(value => enums.filter(enumItem => enumItem[value]).length)
        .length == values.length
    );
  }

  defaultMessage() {
    return 'All saleTypes ($value) must be a valid enum values';
  }
}
