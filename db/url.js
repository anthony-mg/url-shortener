"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createURL = createURL;
exports.getURL = getURL;
var _1 = require("./");
function createURL(url, slug) {
    try {
        var stmt = _1.db.prepare("INSERT INTO urls (slug, url) VALUES (?, ?)");
        return stmt.run(slug, url);
    }
    catch (error) {
        var typedError = error;
        if (typedError.errno == 1555) {
            throw error;
        }
    }
}
function getURL(slug) {
    var stmt = _1.db.prepare("SELECT * from urls where slug = ?");
    var result = stmt.get(slug);
    if (result && typeof result === "object" && typeof result.url === "string") {
        return result.url;
    }
    return "";
}
