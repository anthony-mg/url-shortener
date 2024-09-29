import { ShortUrl } from "@/types/URL";
import { db } from "./";
import { SQLiteError } from "bun:sqlite";

export function createURL(url: string, slug: string) {
  try {
    const stmt = db.prepare("INSERT INTO urls (slug, long_url) VALUES (?, ?)");
    return stmt.run(slug, url);
  } catch (error) {
    const typedError = error as SQLiteError;
    if (typedError.errno == 1555) {
      throw error;
    }
  }
}

export function getURL(slug: string) {
  const stmt = db.prepare("SELECT * from urls where slug = ?");
  return stmt.get(slug);
}
