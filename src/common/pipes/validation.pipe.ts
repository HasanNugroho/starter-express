import { ClassConstructor, plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

export const validator = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: Object
): Promise<{ err: boolean, errors: { field: string, message: string }[] | null }> => {
  const objInstance = plainToClass(dto, obj);
  const errors = await validate(objInstance);
  if (errors.length > 0) {
    return {
      err: true,
      errors: mapErrors(errors),
    };
  }
  return {
    err: false,
    errors: null,
  }
};

const mapErrors = (rawErrors: ValidationError[]) => {
  return rawErrors.flatMap(error => {
    if (error.constraints) {
      return Object.entries(error.constraints).map(([constraintKey, message]) => ({
        field: error.property,
        message,
      }));
    }
    return [];
  });
};