<?php

namespace App\Calendar\Application;

use App\Calendar\Domain\Entity\CalendarEvent;
use App\User\Domain\Entity\User;

final class CalendarEventFactory
{
    public function createFromRequestData(array $data, User $owner): CalendarEvent
    {
        $startsAt = new \DateTimeImmutable((string) ($data['startsAt'] ?? 'today 09:00'));
        $endsAt = !empty($data['endsAt']) ? new \DateTimeImmutable((string) $data['endsAt']) : null;

        return (new CalendarEvent())
            ->setOwner($owner)
            ->setTitle((string) ($data['title'] ?? ''))
            ->setDescription($data['description'] ?? null)
            ->setStartsAt($startsAt)
            ->setEndsAt($endsAt)
            ->setColor((string) ($data['color'] ?? '#2f81f7'));
    }
}

