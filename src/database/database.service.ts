import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';

const entitiesLists = Object.values(entities);

export const databaseProvider = TypeOrmModule.forRootAsync({
  imports: [ConfigModule.forRoot({})],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get<string>('PGHOST'),
      port: configService.get<number>('PGPORT'),
      username: configService.get<string>('PGUSER'),
      password: configService.get<string>('PGPASSWORD'),
      database: configService.get<string>('PGDATABASE'),
      logging: false,
      // ssl: true,
      entities: entitiesLists,
      synchronize: false,
      then: Logger.debug(
        `PostgreSQL host:${configService.get<string>('PGHOST')}`,
        `Database Module`,
      ),
    };
  },
});
