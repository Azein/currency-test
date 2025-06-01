import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: true,
    entities: [join(__dirname, "entities", "*.entity.{ts,js}")],
    migrations: [join(__dirname, "migrations", "*.{ts,js}")],
    subscribers: []
}); 