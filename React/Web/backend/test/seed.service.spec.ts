import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedService } from '@/database/seed.service';
import { User } from '@/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'uuid-1',
    username: 'admin1',
    email: 'admin1@template.com',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    jest.clearAllMocks();
    delete process.env.ADMIN_GOOGLE_EMAIL;
  });

  afterEach(() => {
    delete process.env.ADMIN_GOOGLE_EMAIL;
  });

  // ─── seedAdmins ─────────────────────────────────────────────────────────────

  describe('seedAdmins', () => {
    it('crée les 3 admins quand aucun n\'existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );

      await service.onApplicationBootstrap();

      const adminCalls = mockRepo.create.mock.calls.filter(
        ([d]: [Partial<User>]) => d.role === 'admin',
      );
      expect(adminCalls).toHaveLength(3);
      expect(adminCalls[0][0]).toMatchObject({
        username: 'admin1',
        email: 'admin1@template.com',
        role: 'admin',
        passwordHash: 'hashed',
      });
      expect(adminCalls[1][0].username).toBe('admin2');
      expect(adminCalls[2][0].username).toBe('admin3');
    });

    it('saute un admin qui existe déjà', async () => {
      // admin1 existe, admin2 et admin3 non, aucun user
      mockRepo.findOne
        .mockResolvedValueOnce(mockUser({ username: 'admin1' })) // admin1 → skip
        .mockResolvedValue(null); // admin2, admin3, user1..10 → create

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );

      await service.onApplicationBootstrap();

      const adminCalls = mockRepo.create.mock.calls.filter(
        ([d]: [Partial<User>]) => d.role === 'admin',
      );
      expect(adminCalls).toHaveLength(2); // admin2 + admin3 seulement
    });

    it('ne crée aucun admin si les 3 existent déjà', async () => {
      // Les 3 premières réponses (admins) retournent un user existant
      mockRepo.findOne
        .mockResolvedValueOnce(mockUser({ username: 'admin1' }))
        .mockResolvedValueOnce(mockUser({ username: 'admin2' }))
        .mockResolvedValueOnce(mockUser({ username: 'admin3' }))
        .mockResolvedValue(null); // users → create

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );

      await service.onApplicationBootstrap();

      const adminCalls = mockRepo.create.mock.calls.filter(
        ([d]: [Partial<User>]) => d.role === 'admin',
      );
      expect(adminCalls).toHaveLength(0);
    });
  });

  // ─── seedUsers ───────────────────────────────────────────────────────────────

  describe('seedUsers', () => {
    it('crée 10 utilisateurs classiques quand aucun n\'existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );

      await service.onApplicationBootstrap();

      const userCalls = mockRepo.create.mock.calls.filter(
        ([d]: [Partial<User>]) => d.role === 'user',
      );
      expect(userCalls).toHaveLength(10);
      expect(userCalls[0][0]).toMatchObject({
        username: 'user1',
        email: 'user1@template.com',
        role: 'user',
        passwordHash: 'hashed',
      });
      expect(userCalls[9][0].username).toBe('user10');
    });

    it('saute les utilisateurs qui existent déjà', async () => {
      // 3 admins n'existent pas, user1 existe, user2..10 non
      mockRepo.findOne
        .mockResolvedValueOnce(null) // admin1
        .mockResolvedValueOnce(null) // admin2
        .mockResolvedValueOnce(null) // admin3
        .mockResolvedValueOnce(mockUser({ username: 'user1', role: 'user' })) // user1 → skip
        .mockResolvedValue(null); // user2..10

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );

      await service.onApplicationBootstrap();

      const userCalls = mockRepo.create.mock.calls.filter(
        ([d]: [Partial<User>]) => d.role === 'user',
      );
      expect(userCalls).toHaveLength(9); // user2..10 seulement
    });
  });

  // ─── promoteGoogleAdmin ──────────────────────────────────────────────────────

  describe('promoteGoogleAdmin', () => {
    beforeEach(() => {
      // Tous les seeds passent (aucun utilisateur trouvé)
      mockRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockImplementation((data: Partial<User>) => ({ ...data }));
      mockRepo.save.mockImplementation((data: Partial<User>) =>
        Promise.resolve(data),
      );
    });

    it('promeut le compte Google en admin', async () => {
      process.env.ADMIN_GOOGLE_EMAIL = 'google@example.com';
      const googleUser = mockUser({
        role: 'user',
        email: 'google@example.com',
      });
      // Les findOne des seeds retournent null, celui du Google retourne l'user
      mockRepo.findOne
        .mockResolvedValue(null)
        .mockResolvedValueOnce(googleUser)
        // Le findOne pour Google est le dernier appel
        .mockImplementation(({ where }: { where: Partial<User> }) =>
          'email' in where ? Promise.resolve(googleUser) : Promise.resolve(null),
        );

      await service.onApplicationBootstrap();

      expect(mockRepo.update).toHaveBeenCalledWith(googleUser.id, {
        role: 'admin',
      });
    });

    it('ignore si le compte Google est déjà admin', async () => {
      process.env.ADMIN_GOOGLE_EMAIL = 'google@example.com';
      const googleAdmin = mockUser({
        role: 'admin',
        email: 'google@example.com',
      });
      mockRepo.findOne.mockImplementation(
        ({ where }: { where: Partial<User> }) =>
          'email' in where
            ? Promise.resolve(googleAdmin)
            : Promise.resolve(null),
      );

      await service.onApplicationBootstrap();

      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('ignore si ADMIN_GOOGLE_EMAIL non défini', async () => {
      delete process.env.ADMIN_GOOGLE_EMAIL;

      await service.onApplicationBootstrap();

      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('ne lève pas d\'erreur si le compte Google est introuvable', async () => {
      process.env.ADMIN_GOOGLE_EMAIL = 'unknown@example.com';
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.onApplicationBootstrap()).resolves.not.toThrow();
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });
});

