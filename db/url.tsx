import { db } from "./";
import { SQLiteError } from "bun:sqlite";

export function createURL(url: string, slug: string) {
  try {
    const stmt = db.prepare("INSERT INTO urls (slug, url) VALUES (?, ?)");
    return stmt.run(slug, url);
  } catch (error) {
    const typedError = error as SQLiteError;
    if (typedError.errno == 1555) {
      throw error;
    }
  }
}

export function getURL(slug: string): string {
  const stmt = db.prepare("SELECT * from urls where slug = ?");
  const result = stmt.get(slug);

  if (result && typeof result === "object" && typeof (result as any).url === "string") {
    return (result as { url: string }).url;
  }

  return "";
}
