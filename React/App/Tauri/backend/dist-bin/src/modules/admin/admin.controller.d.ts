import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): {
        message: string;
        timestamp: string;
    };
    getAllUsers(): Promise<import("../user/entities/user.entity").User[]>;
    updateUserRole(id: string, body: {
        role: 'user' | 'admin';
    }): Promise<import("../user/entities/user.entity").User | null>;
}
