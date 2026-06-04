// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getDatabaseConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => {
//   const nodeEnv = configService.get<string>('NODE_ENV', 'development');
//   const databaseUrl = configService.get<string>('DATABASE_URL');

//   // If DATABASE_URL is provided (production), use it
//   if (databaseUrl && databaseUrl.startsWith('postgres')) {
//     return {
//       type: 'postgres',
//       url: databaseUrl,
//       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       synchronize: nodeEnv === 'development',
//       logging: nodeEnv === 'development',
//       migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
//       migrationsRun: false,
//       ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
//     };
//   }

//   // Fallback to individual config (development)
//   return {
//     type: 'postgres',
//     host: configService.get<string>('DB_HOST', 'localhost'),
//     port: configService.get<number>('DB_PORT', 5432),
//     username: configService.get<string>('DB_USERNAME', 'buzzer'),
//     password: configService.get<string>('DB_PASSWORD', 'buzzer_password'),
//     database: configService.get<string>('DB_NAME', 'buzzer_db'),
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     synchronize: nodeEnv === 'development',
//     logging: nodeEnv === 'development',
//     migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
//     migrationsRun: false,
//   };
// };
