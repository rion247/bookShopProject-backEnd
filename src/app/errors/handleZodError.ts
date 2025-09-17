import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Validation Error';

  const errorSources: TErrorSources = err?.issues?.map((issue) => {
    return {
      path: issue?.path[issue?.path?.length - 1] as string | number,
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodError;
