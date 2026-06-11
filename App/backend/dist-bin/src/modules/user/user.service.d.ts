import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    linkGoogleId(id: string, googleId: string): Promise<User>;
    findAll(): Promise<User[]>;
    updateRole(id: string, role: 'user' | 'admin'): Promise<User | null>;
}
