import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const existing = await this.userService.findByUsername(dto.username);
    if (existing)
      throw new ConflictException("Ce nom d'utilisateur est déjà pris");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      username: dto.username,
      passwordHash,
      role: 'user',
    });

    return this.buildAuthResponse(user);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userService.findByUsername(dto.username);
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Identifiants invalides');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Identifiants invalides');

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User): {
    accessToken: string;
    user: Partial<User>;
  } {
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const { passwordHash, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
  }
}
