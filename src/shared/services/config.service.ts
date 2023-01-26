import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

export class ConfigService {
  constructor() {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `.${nodeEnv}.env`,
    });

    if (nodeEnv === 'development') {
      console.info(process.env);
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + '/../../modules/**/*.entity.{ts,js}'];
    let migrations = [__dirname + '/../../migrations/*.{ts,js}'];

    if ((module as any).hot) {
      const entityContext = (require as any).context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map(id => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (require as any).context(
        './../../migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map(id => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }
    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
      ssl: this.get('DB_SSL_CERT')
        ? {
            rejectUnauthorized: true,
            ca: this.get('DB_SSL_CERT'),
          }
        : false,
      migrationsRun: true,
      logging: this.nodeEnv === 'development',
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
    };
  }
}
