import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl && databaseUrl.startsWith('postgres')) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
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
    database: configService.get<string>('DATABASE_PATH', 'app.sqlite'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  };
};
