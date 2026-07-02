<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:seed', description: 'Peuple la base de données avec des comptes de test.')]
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
        $repo = $this->em->getRepository(User::class);

        // Admins : admin1–3 / mdp: admin
        for ($i = 1; $i <= 3; $i++) {
            if ($repo->findOneBy(['email' => "admin{$i}@template.com"])) {
                continue;
            }
            $user = (new User())
                ->setEmail("admin{$i}@template.com")
                ->setUsername("admin{$i}")
                ->setDisplayName("Admin {$i}")
                ->setRoles(['ROLE_ADMIN']);
            $user->setPassword($this->hasher->hashPassword($user, 'admin'));
            $this->em->persist($user);
            $io->writeln("  Créé : admin{$i}@template.com");
        }

        // Utilisateurs : user1–10 / mdp: password
        for ($i = 1; $i <= 10; $i++) {
            if ($repo->findOneBy(['email' => "user{$i}@template.com"])) {
                continue;
            }
            $user = (new User())
                ->setEmail("user{$i}@template.com")
                ->setUsername("user{$i}")
                ->setDisplayName("User {$i}")
                ->setRoles(['ROLE_USER']);
            $user->setPassword($this->hasher->hashPassword($user, 'password'));
            $this->em->persist($user);
            $io->writeln("  Créé : user{$i}@template.com");
        }

        $this->em->flush();
        $io->success('Base de données peuplée.');

        return Command::SUCCESS;
    }
}
