<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260702000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table user avec email, username, displayName, roles, password.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            CREATE TABLE "user" (
                id           SERIAL        PRIMARY KEY NOT NULL,
                email        VARCHAR(180)  NOT NULL,
                username     VARCHAR(50)   NOT NULL,
                display_name VARCHAR(120)  NOT NULL,
                roles        JSON          NOT NULL,
                password     VARCHAR(255)  NOT NULL,
                created_at   TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
            )
        SQL);

        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_EMAIL    ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_USERNAME ON "user" (username)');
        $this->addSql("COMMENT ON COLUMN \"user\".created_at IS '(DC2Type:datetime_immutable)'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE "user"');
    }
}
