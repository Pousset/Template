<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('', name: 'app_admin')]
    public function index(UserRepository $userRepo): Response
    {
        $users  = $userRepo->findBy([], ['createdAt' => 'DESC']);
        $admins = array_filter($users, fn ($u) => $u->isAdmin());

        return $this->render('admin/index.html.twig', [
            'users'       => $users,
            'total_users' => count($users),
            'total_admins' => count($admins),
        ]);
    }
}
