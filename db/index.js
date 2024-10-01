"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var bun_sqlite_1 = require("bun:sqlite");
var db = new bun_sqlite_1.Database("./db/db.db");
exports.db = db;
db.exec("\n  CREATE TABLE IF NOT EXISTS urls (\n    slug TEXT PRIMARY KEY,\n    url TEXT NOT NULL\n  )");
