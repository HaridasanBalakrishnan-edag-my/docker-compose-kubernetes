import dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'snake-naming.strategy';
import { DataSource } from 'typeorm';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});

const source = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CERT,
      }
    : false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{ts,js}'],
});

export default source;
