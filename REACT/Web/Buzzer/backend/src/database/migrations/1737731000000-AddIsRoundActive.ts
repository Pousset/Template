import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumns1737731000000 implements MigrationInterface {
    name = 'AddMissingColumns1737731000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check and add missing columns to sessions table
        
        // Add isRoundActive if it doesn't exist
        const isRoundActiveExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sessions' AND column_name='isRoundActive'
        `);
        if (isRoundActiveExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "sessions" ADD "isRoundActive" boolean NOT NULL DEFAULT false`);
        }

        // Add currentRoundPoints if it doesn't exist
        const currentRoundPointsExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sessions' AND column_name='currentRoundPoints'
        `);
        if (currentRoundPointsExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "sessions" ADD "currentRoundPoints" integer NOT NULL DEFAULT 1`);
        }

        // Add rematchVotes if it doesn't exist
        const rematchVotesExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sessions' AND column_name='rematchVotes'
        `);
        if (rematchVotesExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "sessions" ADD "rematchVotes" json`);
        }

        // Add currentRound if it doesn't exist
        const currentRoundExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='sessions' AND column_name='currentRound'
        `);
        if (currentRoundExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "sessions" ADD "currentRound" integer NOT NULL DEFAULT 0`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns if they exist
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN IF EXISTS "isRoundActive"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN IF EXISTS "currentRoundPoints"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN IF EXISTS "rematchVotes"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN IF EXISTS "currentRound"`);
    }
}
