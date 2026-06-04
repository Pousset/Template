// import { DataSource } from 'typeorm';
// import { config } from 'dotenv';

// config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT ?? '0') || 5432,
//   username: process.env.DB_USERNAME || 'buzzer',
//   password: process.env.DB_PASSWORD || 'buzzer_password',
//   database: process.env.DB_NAME || 'buzzer_db',
//   entities: ['src/modules/**/*.entity.ts'],
//   migrations: ['src/database/migrations/*.ts'],
//   synchronize: false,
//   logging: true,
// });
