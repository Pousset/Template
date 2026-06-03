import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not defined');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    ssl: { rejectUnauthorized: false },
    logging: true,
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected');

    console.log('🔄 Running migrations...');
    const migrations = await dataSource.runMigrations();
    
    if (migrations.length === 0) {
      console.log('✅ No migrations to run - database is up to date');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    }

    await dataSource.destroy();
    console.log('✅ Migration process completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
