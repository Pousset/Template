import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async getAllUsers() {
    return this.userService.findAll();
  }

  async updateUserRole(id: string, role: 'user' | 'admin') {
    return this.userService.updateRole(id, role);
  }

  getDashboard() {
    return {
      message: "Bienvenue dans l'espace admin",
      timestamp: new Date().toISOString(),
    };
  }
}
