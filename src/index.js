"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLogger = void 0;
var jsx_runtime_1 = require("hono/jsx/jsx-runtime");
var hono_1 = require("hono");
var logger_1 = require("hono/logger");
var request_id_1 = require("hono/request-id");
var bun_1 = require("hono/bun");
var components_1 = require("./components/components");
var nanoid_1 = require("nanoid");
var url_1 = require("@/db/url");
var zod_1 = require("zod");
var nanoid = (0, nanoid_1.customAlphabet)("1234567890abcdefghijklmnopqrstuvwxyz", 6);
var app = new hono_1.Hono();
var customLogger = function (message) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    console.log.apply(console, __spreadArray([message], rest, false));
};
exports.customLogger = customLogger;
app.use((0, logger_1.logger)(exports.customLogger));
app.use("*", (0, request_id_1.requestId)({ limitLength: 1 }));
app.use("*", (0, bun_1.serveStatic)({ root: "./static" }));
app.get("*", components_1.Renderer);
var schema = zod_1.z.object({
    url: zod_1.z
        .string({ message: "Please provide a URL" })
        .url({ message: "Invalid URL format. Please include http:// or https://." }),
    slug: zod_1.z
        .string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "Invalid slug. Only alphanumeric (only a-z, 0-9 is accepted)" })
        .or(zod_1.z.literal("")),
});
app.get("/", function (c) {
    return c.render((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(components_1.Form, { short_url: {}, errors: {} }) }));
});
app.get("/:slug", function (c) {
    var slug = c.req.param("slug");
    var url = (0, url_1.getURL)(slug);
    if (url === "") {
        return c.html((0, jsx_runtime_1.jsx)(components_1.Error, {}));
    }
    return c.redirect(url);
});
app.post("/url", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, url, slug, short_url, errors, issues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.parseBody()];
            case 1:
                body = _a.sent();
                url = typeof body["url"] === "string" ? body["url"] : "";
                slug = typeof body["slug"] === "string" ? body["slug"].toLowerCase() : "";
                short_url = { url: url, slug: slug };
                errors = {};
                try {
                    schema.parse(short_url);
                }
                catch (error) {
                    if (!(error instanceof zod_1.ZodError))
                        return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Error, { short_url: short_url }))];
                    issues = error.errors;
                    console.log(issues);
                    errors.url = issues.filter(function (issue) { return issue.path[0] == "url"; }).map(function (issue) { return issue.message; })[0];
                    errors.slug = issues.filter(function (issue) { return issue.path[0] == "slug"; }).map(function (issue) { return issue.message; })[0];
                    return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Form, { short_url: short_url, errors: errors }))];
                }
                //if user did not provide a slug, create one
                if (!slug) {
                    slug = nanoid();
                    short_url.slug = slug;
                }
                //try adding to db
                try {
                    (0, url_1.createURL)(url, slug);
                }
                catch (error) {
                    errors = { slug: "slug in use, pick another" };
                    return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Form, { short_url: short_url, errors: errors }))];
                }
                (0, exports.customLogger)("Short URL saved:", "URL: ".concat(short_url.url, ","), "SLUG: ".concat(short_url.slug));
                return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Confirmed, { short_url: short_url }))];
        }
    });
}); });
app.post("/url/validate", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, url, slug, new_url, exists, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.parseBody()];
            case 1:
                body = _a.sent();
                url = typeof body["url"] === "string" ? body["url"] : "";
                slug = typeof body["slug"] === "string" ? body["slug"] : "";
                new_url = { url: url, slug: slug };
                exists = (0, url_1.getURL)(slug);
                if (exists) {
                    errors = { slug: "slug in use, pick another." };
                    return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Form, { short_url: new_url, errors: errors }))];
                }
                return [2 /*return*/, c.html((0, jsx_runtime_1.jsx)(components_1.Form, { short_url: new_url, errors: {} }))];
        }
    });
}); });
exports.default = {
    port: parseInt(process.env.PORT) || 3000,
    fetch: app.fetch,
};
