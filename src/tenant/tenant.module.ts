import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Connection, createConnection, getConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { Tenant } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { TenantProvider } from './tenant.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantProvider],
  exports: [TenantProvider],
  controllers: [TenantController],
})
export class TenantModule {
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}

  /**
   *
   * @param consumer
   *
   * NOTES: Create new database each time query to an API contain 'tenant' prefix (E.g: /benit/api/users, benit.local)
   * Create new connection to the tenant's database. Otherwise, process to the default connection
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.headers.host.split('.')[0];
        const tenant: Tenant = await this.tenantService.findOne(name);

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exists',
          );
        }

        try {
          getConnection(tenant.name);
          next();
        } catch (e) {
          const dbExisted = await this.connection.query(
            `SELECT datname
             FROM pg_catalog.pg_database
             WHERE datname = '${tenant.name}'`,
          );

          if (dbExisted.length === 0) {
            await this.connection.query(`CREATE DATABASE ${tenant.name}`);
          }

          const createdConnection: Connection = await createConnection({
            name: tenant.name,
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: tenant.name,
            entities: [User], // TODO: Add Entities
            synchronize: true,
          });

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      })
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
