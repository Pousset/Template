<?php

namespace App\Shared\Command;

use App\User\Domain\Entity\User;
use App\User\Domain\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed',
    description: 'Seed la base de données avec 3 admins et 10 utilisateurs.',
)]
class SeedCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $hasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $userRepo = $this->em->getRepository(User::class);

        // ── Admins ────────────────────────────────────────────────────────────
        // Credentials identiques sur tous les projets : adminN@template.com / admin
        $admins = [
            ['Admin 1', 'admin1@template.com'],
            ['Admin 2', 'admin2@template.com'],
            ['Admin 3', 'admin3@template.com'],
        ];

        foreach ($admins as [$displayName, $email]) {
            if ($userRepo->findOneBy(['email' => $email])) {
                $io->note("Admin déjà existant : {$email}");
                continue;
            }

            $user = new User();
            $user->setEmail($email);
            $user->setDisplayName($displayName);
            $user->setRoles([UserRole::Admin->value]);
            $user->setPassword($this->hasher->hashPassword($user, 'admin'));

            $this->em->persist($user);
            $io->success("Admin créé : {$email}");
        }

        // ── Utilisateurs classiques ───────────────────────────────────────────
        // Credentials identiques sur tous les projets : userN@template.com / password
        for ($i = 1; $i <= 10; $i++) {
            $email = "user{$i}@template.com";

            if ($userRepo->findOneBy(['email' => $email])) {
                $io->note("Utilisateur déjà existant : {$email}");
                continue;
            }

            $user = new User();
            $user->setEmail($email);
            $user->setDisplayName("User {$i}");
            $user->setRoles([UserRole::User->value]);
            $user->setPassword($this->hasher->hashPassword($user, 'password'));

            $this->em->persist($user);
            $io->success("Utilisateur créé : {$email}");
        }

        $this->em->flush();

        $io->info('Seed terminé — 3 admins + 10 utilisateurs.');

        return Command::SUCCESS;
    }
}
