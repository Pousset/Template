<?php

namespace App\Calendar\Infrastructure\Repository;

use App\Calendar\Domain\Entity\CalendarEvent;
use App\User\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<CalendarEvent> */
final class CalendarEventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CalendarEvent::class);
    }

    /** @return list<CalendarEvent> */
    public function findUpcomingForUser(User $user, int $limit = 8): array
    {
        return $this->createQueryBuilder('event')
            ->andWhere('event.owner = :owner')
            ->andWhere('event.startsAt >= :now')
            ->setParameter('owner', $user)
            ->setParameter('now', new \DateTimeImmutable('today'))
            ->orderBy('event.startsAt', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function save(CalendarEvent $event, bool $flush = true): void
    {
        $this->getEntityManager()->persist($event);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}

