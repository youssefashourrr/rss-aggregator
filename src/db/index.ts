import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { readConfig } from "src/config";
import * as schema from "src/db/schema";


const config = readConfig();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });