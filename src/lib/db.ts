import { drizzle } from "drizzle-orm/node-postgres";
import {DATABASE_URL} from "@/lib/env";
import * as schema from "@/db/schema"

const db = drizzle(DATABASE_URL, schema);

export default db;