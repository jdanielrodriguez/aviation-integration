import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749941738575 implements MigrationInterface {
    name = 'InitSchema1749941738575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`airports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`airport_name\` varchar(255) NOT NULL, \`iata_code\` varchar(255) NOT NULL, \`icao_code\` varchar(255) NOT NULL, \`latitude\` decimal(10,6) NULL, \`longitude\` decimal(10,6) NULL, \`timezone\` varchar(255) NULL, \`gmt\` varchar(255) NULL, \`country_name\` varchar(255) NULL, \`country_iso2\` varchar(255) NULL, \`city_iata_code\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_calls\` (\`id\` int NOT NULL AUTO_INCREMENT, \`endpoint\` varchar(255) NOT NULL, \`parameters\` json NOT NULL, \`response\` json NOT NULL, \`status_code\` int NOT NULL, \`timestamp\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`flights\` (\`id\` int NOT NULL AUTO_INCREMENT, \`flight_date\` varchar(255) NOT NULL, \`flight_status\` varchar(255) NOT NULL, \`departure\` json NOT NULL, \`arrival\` json NOT NULL, \`airline\` json NOT NULL, \`flight\` json NOT NULL, \`aircraft\` json NULL, \`live\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`flights\``);
        await queryRunner.query(`DROP TABLE \`api_calls\``);
        await queryRunner.query(`DROP TABLE \`airports\``);
    }

}
