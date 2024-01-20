import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  logging: false,
  synchronize: false,
  entities: [
    './src/database/entities/**/*.entity{.ts, .js}',
    './src/database/entities/**/**/*.entity{.ts, .js}',
  ],
  migrationsTableName: 'migrations_table',
  migrations: ['./migrations/*.{js,ts}'],
};

export const dataSource = new DataSource(databaseConfig);
