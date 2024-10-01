"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.Confirmed = exports.Form = exports.Renderer = void 0;
var jsx_runtime_1 = require("hono/jsx/jsx-runtime");
var html_1 = require("hono/html");
var jsx_renderer_1 = require("hono/jsx-renderer");
exports.Renderer = (0, jsx_renderer_1.jsxRenderer)(function (_a) {
    var children = _a.children;
    return (0, html_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <!DOCTYPE html>\n    <html data-theme=\"dark\">\n      <head>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <script src=\"https://unpkg.com/htmx.org@1.9.3\"></script>\n        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css\" />\n        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css\" />\n        <link rel=\"stylesheet\" href=\"/styles/styles.css\" />\n        <title>ANTSH - URLs but shorter</title>\n      </head>\n      <body class=\"flex\">\n        <h2>ANTSH -- Shorter URLs</h2>\n        <main class=\"container\">", "</main>\n      </body>\n    </html>\n  "], ["\n    <!DOCTYPE html>\n    <html data-theme=\"dark\">\n      <head>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <script src=\"https://unpkg.com/htmx.org@1.9.3\"></script>\n        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css\" />\n        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css\" />\n        <link rel=\"stylesheet\" href=\"/styles/styles.css\" />\n        <title>ANTSH - URLs but shorter</title>\n      </head>\n      <body class=\"flex\">\n        <h2>ANTSH -- Shorter URLs</h2>\n        <main class=\"container\">", "</main>\n      </body>\n    </html>\n  "])), children);
});
var Form = function (_a) {
    var short_url = _a.short_url, errors = _a.errors;
    return ((0, jsx_runtime_1.jsxs)("form", { "hx-post": "/url", "hx-swap": "outerHTML", id: "form", children: [(0, jsx_runtime_1.jsx)("input", { autocomplete: "off", "aria-invalid": errors.url ? true : "", placeholder: "your long url", type: "text", name: "url", value: short_url.url }), (0, jsx_runtime_1.jsx)("input", { autocomplete: "off", "aria-invalid": errors.slug ? true : "", type: "text", name: "slug", placeholder: "your cool /slug (Ex: cool --> antsh.one/cool)", value: short_url.slug }), (0, jsx_runtime_1.jsx)("div", { className: errors.url ? "pico-color-red-500" : "", children: errors.url }), (0, jsx_runtime_1.jsx)("div", { className: errors.slug ? "pico-color-red-500" : "", children: errors.slug }), (0, jsx_runtime_1.jsx)("input", { type: "submit", value: "Submit" })] }));
};
exports.Form = Form;
var Confirmed = function (_a) {
    var short_url = _a.short_url;
    return ((0, jsx_runtime_1.jsxs)("section", { class: "flex", children: ["Success! Your short url is:", (0, jsx_runtime_1.jsxs)("button", { class: "outline secondary", children: ["antsh.one/", short_url.slug] })] }));
};
exports.Confirmed = Confirmed;
var Error = function () { return (0, jsx_runtime_1.jsx)("div", { children: "error" }); };
exports.Error = Error;
var templateObject_1;
