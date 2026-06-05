import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      this.logger.warn(
        'ADMIN_USERNAME ou ADMIN_PASSWORD non défini — seed admin ignoré.',
      );
      return;
    }

    const existing = await this.userRepository.findOne({
      where: { username },
    });

    if (existing) {
      // Ignorer silencieusement si l'admin existe déjà
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = this.userRepository.create({
      username,
      passwordHash,
      role: 'admin',
    });

    await this.userRepository.save(admin);
    this.logger.log(`Compte admin "${username}" créé avec succès.`);
  }
}
