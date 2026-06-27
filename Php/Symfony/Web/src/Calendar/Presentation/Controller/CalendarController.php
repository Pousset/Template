<?php

namespace App\Calendar\Presentation\Controller;

use App\Calendar\Application\CalendarEventFactory;
use App\Calendar\Infrastructure\Repository\CalendarEventRepository;
use App\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class CalendarController extends AbstractController
{
    #[Route('/calendar', name: 'app_calendar', methods: ['GET', 'POST'])]
    public function index(
        Request $request,
        CalendarEventRepository $events,
        CalendarEventFactory $factory,
    ): Response {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException();
        }

        if ($request->isMethod('POST')) {
            $event = $factory->createFromRequestData($request->request->all(), $user);
            $events->save($event);
            $this->addFlash('success', 'Evenement ajoute au calendrier.');

            return $this->redirectToRoute('app_calendar');
        }

        return $this->render('calendar/index.html.twig', [
            'events' => $events->findUpcomingForUser($user),
        ]);
    }
}

