import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    findOrCreateGoogleUser(profile: {
        googleId: string;
        email: string | null;
        displayName: string;
    }): Promise<User>;
    loginWithGoogle(user: User): {
        accessToken: string;
    };
    private buildAuthResponse;
}
