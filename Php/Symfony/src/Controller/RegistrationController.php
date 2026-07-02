<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(
        Request $request,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em,
        UserRepository $userRepo,
    ): Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_dashboard');
        }

        $errors = [];

        if ($request->isMethod('POST')) {
            $email       = mb_strtolower(trim((string) $request->request->get('email', '')));
            $username    = mb_strtolower(trim((string) $request->request->get('username', '')));
            $displayName = trim((string) $request->request->get('display_name', ''));
            $password    = (string) $request->request->get('password', '');
            $confirm     = (string) $request->request->get('password_confirm', '');
            $csrf        = (string) $request->request->get('_csrf_token', '');

            if (!$this->isCsrfTokenValid('register', $csrf)) {
                $errors[] = 'Token CSRF invalide.';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'Adresse e-mail invalide.';
            } elseif (!preg_match('/^[a-z0-9_-]{3,50}$/', $username)) {
                $errors[] = "Nom d'utilisateur invalide (3-50 caractères : lettres, chiffres, _ ou -).";
            } elseif ($userRepo->findOneBy(['email' => $email])) {
                $errors[] = 'Cette adresse e-mail est déjà utilisée.';
            } elseif ($userRepo->findOneBy(['username' => $username])) {
                $errors[] = "Ce nom d'utilisateur est déjà pris.";
            } elseif (strlen($password) < 8) {
                $errors[] = 'Le mot de passe doit contenir au moins 8 caractères.';
            } elseif ($password !== $confirm) {
                $errors[] = 'Les mots de passe ne correspondent pas.';
            } else {
                $user = (new User())
                    ->setEmail($email)
                    ->setUsername($username)
                    ->setDisplayName($displayName ?: $username)
                    ->setRoles(['ROLE_USER']);
                $user->setPassword($hasher->hashPassword($user, $password));
                $em->persist($user);
                $em->flush();

                $this->addFlash('success', 'Compte créé ! Vous pouvez maintenant vous connecter.');
                return $this->redirectToRoute('app_login');
            }
        }

        return $this->render('registration/register.html.twig', ['errors' => $errors]);
    }
}
