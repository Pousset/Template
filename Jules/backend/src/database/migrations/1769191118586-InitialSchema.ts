import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769191118586 implements MigrationInterface {
    name = 'InitialSchema1769191118586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "totalRounds"`);
        await queryRunner.query(`ALTER TABLE "players" ADD "isConnected" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "players" ADD "avatar" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "players"."avatar" IS 'Emoji avatar'`);
        await queryRunner.query(`ALTER TABLE "players" ADD "color" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "players"."color" IS 'Tailwind color class'`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "matchDuration" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."matchDuration" IS 'Nombre de manches'`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "defaultPoints" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."defaultPoints" IS 'Points par défaut par manche'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."muteTime" IS 'Temps de mute après mauvaise réponse (secondes)'`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "muteTime" SET DEFAULT '5'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."responseTime" IS 'Temps de réponse après buzz (secondes)'`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "responseTime" SET DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "responseTime" SET DEFAULT '30'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."responseTime" IS 'Temps max pour répondre (secondes)'`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "muteTime" SET DEFAULT '10'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."muteTime" IS 'Temps de mute après buzzer raté (secondes)'`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."defaultPoints" IS 'Points par défaut par manche'`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "defaultPoints"`);
        await queryRunner.query(`COMMENT ON COLUMN "sessions"."matchDuration" IS 'Nombre de manches'`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "matchDuration"`);
        await queryRunner.query(`COMMENT ON COLUMN "players"."color" IS 'Tailwind color class'`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "color"`);
        await queryRunner.query(`COMMENT ON COLUMN "players"."avatar" IS 'Emoji avatar'`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "isConnected"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "totalRounds" integer NOT NULL DEFAULT '10'`);
    }

}
