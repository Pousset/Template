import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@/modules/auth/auth.service';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';

jest.mock('bcrypt');

const mockUser = (): User =>
  ({
    id: 'uuid-1',
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    googleId: null,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as User;

const mockUserService = {
  findByUsername: jest.fn(),
  findByGoogleId: jest.fn(),
  findByEmail: jest.fn(),
  linkGoogleId: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('crée un user et retourne un token', async () => {
      const user = mockUser();
      mockUserService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockUserService.create.mockResolvedValue(user);

      const result = await service.register({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(mockUserService.create).toHaveBeenCalledWith({
        username: 'testuser',
        passwordHash: 'hashed_password',
        role: 'user',
      });
    });

    it('lève ConflictException si le username existe déjà', async () => {
      mockUserService.findByUsername.mockResolvedValue(mockUser());
      await expect(
        service.register({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('retourne un token si les credentials sont valides', async () => {
      const user = mockUser();
      mockUserService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('lève UnauthorizedException si user introuvable', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);
      await expect(
        service.login({ username: 'nope', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lève UnauthorizedException si mot de passe invalide', async () => {
      mockUserService.findByUsername.mockResolvedValue(mockUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.login({ username: 'testuser', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lève UnauthorizedException si le user n\'a pas de passwordHash (compte Google)', async () => {
      mockUserService.findByUsername.mockResolvedValue({
        ...mockUser(),
        passwordHash: null,
      });
      await expect(
        service.login({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOrCreateGoogleUser', () => {
    const profile = {
      googleId: 'google-123',
      email: 'google@example.com',
      displayName: 'Google User',
    };

    it('retourne le user si googleId existe déjà', async () => {
      const user = mockUser();
      mockUserService.findByGoogleId.mockResolvedValue(user);
      expect(await service.findOrCreateGoogleUser(profile)).toEqual(user);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('lie le googleId si l\'email correspond à un compte existant', async () => {
      const user = mockUser();
      mockUserService.findByGoogleId.mockResolvedValue(null);
      mockUserService.findByEmail.mockResolvedValue(user);
      mockUserService.linkGoogleId.mockResolvedValue({
        ...user,
        googleId: 'google-123',
      });

      const result = await service.findOrCreateGoogleUser(profile);
      expect(mockUserService.linkGoogleId).toHaveBeenCalledWith(user.id, 'google-123');
      expect(result.googleId).toBe('google-123');
    });

    it('crée un nouveau user si aucun compte existant', async () => {
      const newUser = { ...mockUser(), googleId: 'google-123', passwordHash: null };
      mockUserService.findByGoogleId.mockResolvedValue(null);
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(newUser);

      const result = await service.findOrCreateGoogleUser(profile);
      expect(mockUserService.create).toHaveBeenCalledWith({
        googleId: 'google-123',
        email: 'google@example.com',
        username: 'Google User',
        passwordHash: null,
        role: 'user',
      });
      expect(result).toEqual(newUser);
    });
  });

  describe('loginWithGoogle', () => {
    it('retourne un accessToken', () => {
      const result = service.loginWithGoogle(mockUser());
      expect(result.accessToken).toBe('mock_jwt_token');
    });

    it('utilise l\'email comme username si username est null', () => {
      service.loginWithGoogle({ ...mockUser(), username: null });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'test@example.com' }),
      );
    });
  });
});
