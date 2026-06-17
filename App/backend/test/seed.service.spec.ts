import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedService } from '@/database/seed.service';
import { User } from '@/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = (overrides = {}): User =>
  ({
    id: 'uuid-1',
    username: 'admin',
    email: null,
    passwordHash: 'hashed',
    googleId: null,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as User;

const mockRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('SeedService', () => {
  let service: SeedService;

  const setupEnv = (vars: Record<string, string | undefined>) => {
    Object.entries(vars).forEach(([k, v]) => {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_GOOGLE_EMAIL;
  });

  // ─── seedAdmin ──────────────────────────────────────────────────────────────

  describe('seedAdmin', () => {
    it('crée le compte admin si inexistant', async () => {
      setupEnv({ ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'secret123' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockUser());
      mockRepo.save.mockResolvedValue(mockUser());

      await service.onApplicationBootstrap();

      expect(mockRepo.create).toHaveBeenCalledWith({
        username: 'admin',
        passwordHash: 'hashed',
        role: 'admin',
      });
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('ignore si le compte admin existe déjà', async () => {
      setupEnv({ ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'secret123' });
      mockRepo.findOne.mockResolvedValue(mockUser());

      await service.onApplicationBootstrap();

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('ignore si ADMIN_USERNAME ou ADMIN_PASSWORD manquant', async () => {
      setupEnv({ ADMIN_USERNAME: undefined, ADMIN_PASSWORD: undefined });

      await service.onApplicationBootstrap();

      expect(mockRepo.findOne).not.toHaveBeenCalled();
    });
  });

  // ─── promoteGoogleAdmin ──────────────────────────────────────────────────────

  describe('promoteGoogleAdmin', () => {
    beforeEach(() => {
      // Désactiver seedAdmin pour ces tests
      setupEnv({ ADMIN_USERNAME: undefined, ADMIN_PASSWORD: undefined });
    });

    it('promeut le user Google en admin', async () => {
      setupEnv({ ADMIN_GOOGLE_EMAIL: 'google@example.com' });
      const user = mockUser({ role: 'user', email: 'google@example.com' });
      mockRepo.findOne.mockResolvedValue(user);

      await service.onApplicationBootstrap();

      expect(mockRepo.update).toHaveBeenCalledWith(user.id, { role: 'admin' });
    });

    it('ignore si le user est déjà admin', async () => {
      setupEnv({ ADMIN_GOOGLE_EMAIL: 'google@example.com' });
      mockRepo.findOne.mockResolvedValue(
        mockUser({ email: 'google@example.com', role: 'admin' }),
      );

      await service.onApplicationBootstrap();

      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it("log un warning si le user n'est pas encore en base", async () => {
      setupEnv({ ADMIN_GOOGLE_EMAIL: 'google@example.com' });
      mockRepo.findOne.mockResolvedValue(null);

      await service.onApplicationBootstrap();

      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('ignore si ADMIN_GOOGLE_EMAIL non défini', async () => {
      setupEnv({ ADMIN_GOOGLE_EMAIL: undefined });

      await service.onApplicationBootstrap();

      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });
});
