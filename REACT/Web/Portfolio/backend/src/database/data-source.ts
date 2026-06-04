import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource =
  databaseUrl && databaseUrl.startsWith('postgres')
    ? new DataSource({
        type: 'postgres',
        url: databaseUrl,
        entities: ['src/modules/**/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: true,
        ssl: { rejectUnauthorized: false },
      })
    : new DataSource({
        type: 'better-sqlite3',
        database: process.env.DATABASE_PATH || 'app.sqlite',
        entities: ['src/modules/**/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: true,
      });
