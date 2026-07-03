import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/user/entities/user.entity';

/**
 * Credentials identiques sur tous les projets du template.
 *
 * Admins (3)       : admin1@template.com → admin3@template.com  / mdp : admin
 * Utilisateurs (10): user1@template.com  → user10@template.com  / mdp : password
 */

const SEED_ADMINS = [
  { username: 'admin1', email: 'admin1@template.com', password: 'admin' },
  { username: 'admin2', email: 'admin2@template.com', password: 'admin' },
  { username: 'admin3', email: 'admin3@template.com', password: 'admin' },
];

const SEED_USERS = Array.from({ length: 10 }, (_, i) => ({
  username: `user${i + 1}`,
  email: `user${i + 1}@template.com`,
  password: 'password',
}));

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedAdmins();
    await this.seedUsers();
    await this.promoteGoogleAdmin();
  }

  private async seedAdmins(): Promise<void> {
    for (const data of SEED_ADMINS) {
      const existing = await this.userRepository.findOne({
        where: { username: data.username },
      });
      if (existing) continue;

      const passwordHash = await bcrypt.hash(data.password, 10);
      const admin = this.userRepository.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'admin',
      });
      await this.userRepository.save(admin);
      this.logger.log(`Admin "${data.username}" créé.`);
    }
  }

  private async seedUsers(): Promise<void> {
    for (const data of SEED_USERS) {
      const existing = await this.userRepository.findOne({
        where: { username: data.username },
      });
      if (existing) continue;

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = this.userRepository.create({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'user',
      });
      await this.userRepository.save(user);
      this.logger.log(`Utilisateur "${data.username}" créé.`);
    }
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
