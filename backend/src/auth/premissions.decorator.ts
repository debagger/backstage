import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: string[]) =>
  SetMetadata('AUTH_PERMISSIONS', permissions);
