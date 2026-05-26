import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/Book";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "library.sqlite",
    synchronize: true,
    logging: false,
    entities: [Book],
});