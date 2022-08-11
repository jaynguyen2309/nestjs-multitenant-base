import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getConnection } from 'typeorm';
import { Request } from 'express';

import { Tenant } from './entities/tenant.entity';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const TenantProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, Connection],
  scope: Scope.REQUEST,
  useFactory: async (req: Request, connection: Connection) => {
    const name: string = req.headers.host.split('.')[0];
    const tenant: Tenant = await connection
      .getRepository(Tenant)
      .findOne({ where: { name } });

    return getConnection(tenant.name);
  },
};
