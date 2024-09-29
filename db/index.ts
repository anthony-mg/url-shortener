import { Database } from "bun:sqlite";

let db = new Database("./db/db.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    slug TEXT PRIMARY KEY,
    long_url TEXT NOT NULL
  )`);

export { db };
