import { createParamDecorator } from '@nestjs/common';

export const Users = createParamDecorator((data, req) => req.user);
