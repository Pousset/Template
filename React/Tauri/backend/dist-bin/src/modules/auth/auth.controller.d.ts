import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/auth.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { User } from '@/modules/user/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    getMe(req: {
        user: Express.User;
    }): Express.User;
    googleAuth(): void;
    googleCallback(req: {
        user: User;
    }, res: Response): void;
}
