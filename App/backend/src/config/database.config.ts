import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/user/entities/user.entity';
import { join } from 'path';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl && databaseUrl.startsWith('postgres')) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [User],
      synchronize: false,
      logging: nodeEnv === 'development',
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
      ssl:
        configService.get<string>('DB_SSL') === 'false'
          ? false
          : { rejectUnauthorized: false },
    };
  }

  return {
    type: 'better-sqlite3',
    database: join(
      __dirname,
      '..',
      '..',
      configService.get<string>('DATABASE_PATH', 'app.sqlite'),
    ),
    entities: [User],
    synchronize: true,
    logging: false,
  };
};
