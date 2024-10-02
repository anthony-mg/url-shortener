import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { Renderer, Form, Confirmed, Error } from "./components/components";
import { customAlphabet } from "nanoid";
import { createURL, getURL } from "@/db/url";
import { ShortUrl } from "@/types/URL";
import { FormError } from "@/types/form";
import { z, ZodError } from "zod";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);
declare module "bun" {
  interface Env {
    PORT: string;
  }
}
const app = new Hono();
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};
app.use(logger(customLogger));
app.use("*", serveStatic({ root: "./static" }));
app.use("*", Renderer);

const schema = z.object({
  url: z
    .string({ message: "Please provide a URL" })
    .url({ message: "Invalid URL format. Please include http:// or https://." }),
  slug: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Invalid slug. Only alphanumeric (only a-z, 0-9 is accepted)" })
    .or(z.literal("")),
});

app.get("/", (c) => {
  return c.render(
    <div>
      <Form short_url={{}} errors={{}}></Form>
    </div>
  );
});

app.get("/:slug", (c) => {
  let slug = c.req.param("slug");
  let url: string = getURL(slug);
  if (url === "") {
    return c.html(<Error message="URL not found"></Error>);
  }
  return c.redirect(url);
});

app.post("/url", async (c) => {
  const body = await c.req.parseBody();
  const url = typeof body["url"] === "string" ? body["url"] : "";
  let slug = typeof body["slug"] === "string" ? body["slug"].toLowerCase() : "";
  let short_url: ShortUrl = { url, slug };
  let errors: FormError = {};

  try {
    schema.parse(short_url);
  } catch (error) {
    if (!(error instanceof ZodError)) return c.html(<Error message={"Validation error"}></Error>);

    let issues = error.errors;
    console.log(issues);
    errors.url = issues.filter((issue) => issue.path[0] == "url").map((issue) => issue.message)[0];
    errors.slug = issues.filter((issue) => issue.path[0] == "slug").map((issue) => issue.message)[0];
    return c.html(<Form short_url={short_url} errors={errors} />);
  }

  //if user did not provide a slug, create one
  if (!slug) {
    slug = nanoid();
    short_url.slug = slug;
  }
  //try adding to db
  try {
    createURL(url, slug);
  } catch (error) {
    errors = { slug: "slug in use, pick another" };
    return c.html(<Form short_url={short_url} errors={errors} />);
  }
  customLogger("Short URL saved:", `URL: ${short_url.url},`, `SLUG: ${short_url.slug}`);
  return c.html(<Confirmed short_url={short_url}></Confirmed>);
});

app.post("/url/validate", async (c) => {
  const body = await c.req.parseBody();
  const url = typeof body["url"] === "string" ? body["url"] : "";
  const slug = typeof body["slug"] === "string" ? body["slug"] : "";
  const new_url: ShortUrl = { url, slug };
  let exists = getURL(slug);
  if (exists) {
    let errors = { slug: "slug in use, pick another." };
    return c.html(<Form short_url={new_url} errors={errors} />);
  }
  return c.html(<Form short_url={new_url} errors={{}} />);
});

export default {
  port: parseInt(process.env.PORT) || 3000,
  fetch: app.fetch,
};
