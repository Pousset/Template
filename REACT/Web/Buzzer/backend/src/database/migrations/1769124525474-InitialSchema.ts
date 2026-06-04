import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769124525474 implements MigrationInterface {
    name = 'InitialSchema1769124525474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rounds_status_enum" AS ENUM('PENDING', 'ACTIVE', 'BUZZED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "rounds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "roundNumber" integer NOT NULL, "points" integer NOT NULL, "status" "public"."rounds_status_enum" NOT NULL DEFAULT 'PENDING', "buzzedById" uuid, "buzzedAt" TIMESTAMP, "answeredCorrectly" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5ad61547abe83e79f96256ec50c" UNIQUE ("sessionId", "roundNumber"), CONSTRAINT "PK_9d254884a20817016e2f877c7e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "pseudo" character varying NOT NULL, "score" integer NOT NULL DEFAULT '0', "isMaster" boolean NOT NULL DEFAULT false, "socketId" character varying, "mutedUntil" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sessions_status_enum" AS ENUM('LOBBY', 'PLAYING', 'FINISHED')`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "status" "public"."sessions_status_enum" NOT NULL DEFAULT 'LOBBY', "muteTime" integer NOT NULL DEFAULT '10', "responseTime" integer NOT NULL DEFAULT '30', "totalRounds" integer NOT NULL DEFAULT '10', "currentRound" integer NOT NULL DEFAULT '0', "masterId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e9f62f5dcb8a54b84234c9e7a06" UNIQUE ("token"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")); COMMENT ON COLUMN "sessions"."muteTime" IS 'Temps de mute après buzzer raté (secondes)'; COMMENT ON COLUMN "sessions"."responseTime" IS 'Temps max pour répondre (secondes)'`);
        await queryRunner.query(`ALTER TABLE "rounds" ADD CONSTRAINT "FK_90a228425cd23d8762a281c3028" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rounds" ADD CONSTRAINT "FK_2fd7712a59d2a77c1b8534d49f4" FOREIGN KEY ("buzzedById") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_6ba252fc05dc5b71cdec04c18b6" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_6ba252fc05dc5b71cdec04c18b6"`);
        await queryRunner.query(`ALTER TABLE "rounds" DROP CONSTRAINT "FK_2fd7712a59d2a77c1b8534d49f4"`);
        await queryRunner.query(`ALTER TABLE "rounds" DROP CONSTRAINT "FK_90a228425cd23d8762a281c3028"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_status_enum"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "rounds"`);
        await queryRunner.query(`DROP TYPE "public"."rounds_status_enum"`);
    }

}
