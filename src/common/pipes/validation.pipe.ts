import { plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

export const validationPipe = async <T extends object>(
  schema: new () => T,
  requestObject: object,
  groups?: string[]
): Promise<{ err: boolean; errors: any[] | null }> => {
  try {
    const transformedClass = plainToInstance(schema, requestObject);
    const options: ValidatorOptions = groups ? { groups } : {};

    const errors = await validate(transformedClass, options);

    return {
      err: errors.length > 0,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    console.error('Validation Error:', error);
    return {
      err: true,
      errors: [new ValidationError()],
    };
  }
};
