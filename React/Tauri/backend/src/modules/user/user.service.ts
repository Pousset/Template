import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.username = :username', { username })
      .getOne();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async linkGoogleId(id: string, googleId: string): Promise<User> {
    await this.userRepository.update(id, { googleId });
    const user = await this.findById(id);
    if (!user) throw new Error(`User ${id} not found after linkGoogleId`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateRole(id: string, role: 'user' | 'admin'): Promise<User | null> {
    await this.userRepository.update(id, { role });
    return this.findById(id);
  }
}
