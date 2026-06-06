import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/user/entities/user.entity';

const mockUser = (): User =>
  ({
    id: 'uuid-1',
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: null,
    googleId: null,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as User;

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  loginWithGoogle: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:5173'),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('délègue à authService.register', async () => {
      const dto = { username: 'testuser', password: 'password123' };
      const expected = { accessToken: 'token', user: mockUser() };
      mockAuthService.register.mockResolvedValue(expected);

      expect(await controller.register(dto)).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('délègue à authService.login', async () => {
      const dto = { username: 'testuser', password: 'password123' };
      const expected = { accessToken: 'token', user: mockUser() };
      mockAuthService.login.mockResolvedValue(expected);

      expect(await controller.login(dto)).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMe', () => {
    it('retourne req.user', () => {
      const user = mockUser();
      expect(controller.getMe({ user } as any)).toEqual(user);
    });
  });

  describe('googleCallback', () => {
    it('redirige vers le frontend avec le token', () => {
      const user = mockUser();
      mockAuthService.loginWithGoogle.mockReturnValue({ accessToken: 'google_token' });
      const res = { redirect: jest.fn() };

      controller.googleCallback({ user }, res as any);

      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:5173/auth/callback?token=google_token',
      );
    });
  });
});
