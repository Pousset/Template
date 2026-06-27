import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '@/modules/admin/admin.service';
import { AdminController } from '@/modules/admin/admin.controller';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';

const mockUser = (overrides = {}): User =>
  ({
    id: 'uuid-1',
    username: 'testuser',
    email: null,
    passwordHash: null,
    googleId: null,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as User;

// ─── AdminService ────────────────────────────────────────────────────────────

const mockUserService = {
  findAll: jest.fn(),
  updateRole: jest.fn(),
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('retourne tous les users', async () => {
      const users = [mockUser(), mockUser({ id: 'uuid-2' })];
      mockUserService.findAll.mockResolvedValue(users);
      expect(await service.getAllUsers()).toEqual(users);
    });
  });

  describe('updateUserRole', () => {
    it('met à jour le rôle et retourne le user', async () => {
      const updated = mockUser({ role: 'admin' });
      mockUserService.updateRole.mockResolvedValue(updated);
      expect(await service.updateUserRole('uuid-1', 'admin')).toEqual(updated);
      expect(mockUserService.updateRole).toHaveBeenCalledWith('uuid-1', 'admin');
    });
  });

  describe('getDashboard', () => {
    it('retourne un message et un timestamp', () => {
      const result = service.getDashboard();
      expect(result.message).toBe("Bienvenue dans l'espace admin");
      expect(result.timestamp).toBeDefined();
    });
  });
});

// ─── AdminController ─────────────────────────────────────────────────────────

const mockAdminService = {
  getAllUsers: jest.fn(),
  updateUserRole: jest.fn(),
  getDashboard: jest.fn(),
};

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(require('@/modules/auth/guards/jwt-auth.guard').JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(require('@/modules/auth/guards/roles.guard').RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('délègue à adminService.getDashboard', () => {
      const expected = { message: "Bienvenue dans l'espace admin", timestamp: 'now' };
      mockAdminService.getDashboard.mockReturnValue(expected);
      expect(controller.getDashboard()).toEqual(expected);
    });
  });

  describe('getAllUsers', () => {
    it('délègue à adminService.getAllUsers', async () => {
      const users = [mockUser()];
      mockAdminService.getAllUsers.mockResolvedValue(users);
      expect(await controller.getAllUsers()).toEqual(users);
    });
  });

  describe('updateUserRole', () => {
    it('délègue à adminService.updateUserRole', async () => {
      const updated = mockUser({ role: 'admin' });
      mockAdminService.updateUserRole.mockResolvedValue(updated);
      expect(await controller.updateUserRole('uuid-1', { role: 'admin' })).toEqual(updated);
      expect(mockAdminService.updateUserRole).toHaveBeenCalledWith('uuid-1', 'admin');
    });
  });
});
