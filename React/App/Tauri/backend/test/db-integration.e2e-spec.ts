import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '@/app.module';
import { User } from '@/modules/user/entities/user.entity';

describe('DB Integration (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  const testDbPath = path.join(__dirname, '..', 'test-e2e.sqlite');

  beforeAll(async () => {
    // Base SQLite dédiée pour ne pas polluer app.sqlite (dev)
    process.env.DATABASE_PATH = 'test-e2e.sqlite';

    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('a accès à la base de données et trouve le compte admin seedé', async () => {
    const adminUsername = process.env.ADMIN_USERNAME;
    expect(adminUsername).toBeDefined();

    const admin = await userRepository.findOne({
      where: { username: adminUsername },
    });

    expect(admin).not.toBeNull();
    expect(admin?.role).toBe('admin');
  });

  it('crée bien un utilisateur en base lors de POST /auth/register', async () => {
    const username = `reg_${Date.now().toString().slice(-10)}`;
    const password = 'password123';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.username).toBe(username);

    const userInDb = await userRepository.findOne({ where: { username } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.role).toBe('user');
  });

  it('met à jour le rôle en base via PATCH /admin/users/:id/role', async () => {
    // 1. Crée un utilisateur classique à promouvoir
    const username = `prom_${Date.now().toString().slice(-10)}`;
    const password = 'password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    const userId: string = registerResponse.body.user.id;

    // 2. Connexion admin pour obtenir un vrai JWT
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      })
      .expect(200);

    const adminToken: string = adminLogin.body.accessToken;
    expect(adminToken).toBeDefined();

    // 3. Promotion en admin via l'endpoint réel
    await request(app.getHttpServer())
      .patch(`/admin/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' })
      .expect(200);

    // 4. Vérification directe en base — pas seulement la réponse HTTP
    const updatedUser = await userRepository.findOne({
      where: { id: userId },
    });
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.role).toBe('admin');
  });
});
