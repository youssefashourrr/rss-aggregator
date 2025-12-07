import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { readConfig } from "../config";
import * as schema from "./schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";

import type { Config } from "../config";

const config: Config = readConfig();
const conn: Sql = postgres(config.dbUrl);
export const db: PostgresJsDatabase<typeof schema> = drizzle(conn, { schema });