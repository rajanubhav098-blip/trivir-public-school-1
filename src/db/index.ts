import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.ts";
import path from "path";
import fs from "fs";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), ".data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const sqlitePath = path.join(dataDir, "trivir.db");

const client = createClient({
  url: `file:${sqlitePath}`,
});

export const db = drizzle(client, { schema });
