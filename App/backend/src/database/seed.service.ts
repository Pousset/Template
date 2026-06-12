import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
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
    await this.promoteGoogleAdmin();
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
      return;
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const admin = this.userRepository.create({
      username,
      passwordHash,
      role: 'admin',
    });

    await this.userRepository.save(admin);
    this.logger.log(`Compte admin "${username}" créé avec succès.`);
  }

  private async promoteGoogleAdmin(): Promise<void> {
    const email = process.env.ADMIN_GOOGLE_EMAIL;
    if (!email) return;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(
        `ADMIN_GOOGLE_EMAIL défini mais aucun compte trouvé pour "${email}" — sera promu au prochain démarrage après sa première connexion.`,
      );
      return;
    }

    if (user.role === 'admin') return;

    await this.userRepository.update(user.id, { role: 'admin' });
    this.logger.log(`Compte Google "${email}" promu admin.`);
  }
}
