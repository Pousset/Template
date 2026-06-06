import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';

const mockUser = (): User =>
  ({
    id: 'uuid-1',
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'hashed',
    googleId: null,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as User;

const mockQueryBuilder = {
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

const mockRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('retourne un user si trouvé', async () => {
      const user = mockUser();
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findById('uuid-1')).toEqual(user);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    });

    it('retourne null si non trouvé', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.findById('nope')).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('retourne un user via queryBuilder', async () => {
      const user = mockUser();
      mockQueryBuilder.getOne.mockResolvedValue(user);
      expect(await service.findByUsername('testuser')).toEqual(user);
    });

    it('retourne null si non trouvé', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      expect(await service.findByUsername('nope')).toBeNull();
    });
  });

  describe('findByGoogleId', () => {
    it('retourne un user si trouvé', async () => {
      const user = mockUser();
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findByGoogleId('google-123')).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('retourne un user si trouvé', async () => {
      const user = mockUser();
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });
  });

  describe('create', () => {
    it('crée et sauvegarde un user', async () => {
      const user = mockUser();
      mockRepo.create.mockReturnValue(user);
      mockRepo.save.mockResolvedValue(user);
      expect(await service.create({ username: 'testuser' })).toEqual(user);
    });
  });

  describe('linkGoogleId', () => {
    it('lie un googleId et retourne le user mis à jour', async () => {
      const user = { ...mockUser(), googleId: 'google-123' };
      mockRepo.update.mockResolvedValue(undefined);
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.linkGoogleId('uuid-1', 'google-123')).toEqual(user);
    });

    it('lève une erreur si user introuvable après update', async () => {
      mockRepo.update.mockResolvedValue(undefined);
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.linkGoogleId('uuid-1', 'google-123')).rejects.toThrow(
        'User uuid-1 not found after linkGoogleId',
      );
    });
  });

  describe('findAll', () => {
    it('retourne tous les users', async () => {
      const users = [mockUser(), { ...mockUser(), id: 'uuid-2' }];
      mockRepo.find.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('updateRole', () => {
    it('met à jour le rôle et retourne le user', async () => {
      const user = { ...mockUser(), role: 'admin' as const };
      mockRepo.update.mockResolvedValue(undefined);
      mockRepo.findOne.mockResolvedValue(user);
      expect(await service.updateRole('uuid-1', 'admin')).toEqual(user);
    });
  });
});
