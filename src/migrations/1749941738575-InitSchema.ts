import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1749941738575 implements MigrationInterface {
    name = 'InitSchema1749941738575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`airports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`airport_name\` varchar(255) NOT NULL, \`iata_code\` varchar(255) NOT NULL, \`icao_code\` varchar(255) NOT NULL, \`latitude\` decimal(10,6) NULL, \`longitude\` decimal(10,6) NULL, \`timezone\` varchar(255) NULL, \`gmt\` varchar(255) NULL, \`country_name\` varchar(255) NULL, \`country_iso2\` varchar(255) NULL, \`city_iata_code\` varchar(255) NULL, UNIQUE INDEX \`IDX_43224ff10f4d81b8b3b6e2fa23\` (\`iata_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_calls\` (\`id\` int NOT NULL AUTO_INCREMENT, \`endpoint\` varchar(255) NOT NULL, \`parameters\` json NOT NULL, \`response\` json NOT NULL, \`status_code\` int NOT NULL, \`timestamp\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`flights\` (\`id\` int NOT NULL AUTO_INCREMENT, \`flight_date\` varchar(255) NOT NULL, \`flight_status\` varchar(255) NOT NULL, \`departure\` json NOT NULL, \`arrival\` json NOT NULL, \`airline\` json NOT NULL, \`flight\` json NOT NULL, \`aircraft\` json NULL, \`live\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`airlines\` (\`id\` int NOT NULL AUTO_INCREMENT, \`airline_name\` varchar(255) NOT NULL, \`iata_code\` varchar(255) NULL, \`icao_code\` varchar(255) NULL, \`callsign\` varchar(255) NULL, \`type\` varchar(255) NULL, \`status\` varchar(255) NULL, \`fleet_size\` varchar(255) NULL, \`fleet_average_age\` varchar(255) NULL, \`date_founded\` varchar(255) NULL, \`hub_code\` varchar(255) NULL, \`iata_prefix_accounting\` varchar(255) NULL, \`country_name\` varchar(255) NULL, \`country_iso2\` varchar(255) NULL, UNIQUE INDEX \`IDX_5241e716bccc251c3b5b545de3\` (\`iata_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5241e716bccc251c3b5b545de3\` ON \`airlines\``);
        await queryRunner.query(`DROP TABLE \`airlines\``);
        await queryRunner.query(`DROP TABLE \`flights\``);
        await queryRunner.query(`DROP TABLE \`api_calls\``);
        await queryRunner.query(`DROP INDEX \`IDX_43224ff10f4d81b8b3b6e2fa23\` ON \`airports\``);
        await queryRunner.query(`DROP TABLE \`airports\``);
    }

}
