import { UserService } from '@/modules/user/user.service';
export declare class AdminService {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import("../user/entities/user.entity").User[]>;
    updateUserRole(id: string, role: 'user' | 'admin'): Promise<import("../user/entities/user.entity").User | null>;
    getDashboard(): {
        message: string;
        timestamp: string;
    };
}
