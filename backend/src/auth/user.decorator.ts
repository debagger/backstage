import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from './auth.utils';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getRequestFromContext(ctx)
    return request.user;
  },
);

