import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLE_DECORATOR_METADATA_KEY } from '../constants';
import { UserRolesEnum } from '../../user/types';

export const Role = (...args: UserRolesEnum[]): CustomDecorator =>
  SetMetadata(ROLE_DECORATOR_METADATA_KEY, args);
