import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { serveStatic } from "hono/bun";
import { Renderer, Form, Confirmed, Error } from "./components/components";
import { customAlphabet } from "nanoid";
import { createURL, getURL } from "@/db/url";
import { ShortUrl } from "@/types/URL";
import { FormError } from "@/types/form";
import { z, ZodError } from "zod";
import { zValidator } from "@hono/zod-validator";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);

const app = new Hono();
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};
app.use(logger(customLogger));
app.use("*", requestId({ limitLength: 1 }));
app.use("*", serveStatic({ root: "./static" }));
app.get("*", Renderer);

const schema = z.object({
  url: z
    .string({ message: "Please provide a URL" })
    .url({ message: "Invalid URL format. Please include http:// or https://." }),
  slug: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Invalid slug. Only alphanumeric (a-z, 0-9 is accepted)" })
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
  return c.text(slug);

  //TODO: get url from db, redirect to url
});

app.post("/url", async (c) => {
  const body = await c.req.parseBody();
  const url = typeof body["url"] === "string" ? body["url"] : "";
  let slug = typeof body["slug"] === "string" ? body["slug"] : "";
  slug = slug.toLowerCase();
  let short_url: ShortUrl = { url, slug };
  let errors: FormError = {};

  try {
    schema.parse(short_url);
  } catch (error) {
    if (!(error instanceof ZodError)) return c.html(<Error short_url={short_url}></Error>);

    let issues = error.errors;
    console.log(issues);
    errors.url = issues.filter((issue) => issue.path[0] == "url").map((issue) => issue.message)[0];
    errors.slug = issues.filter((issue) => issue.path[0] == "slug").map((issue) => issue.message)[0];
    return c.html(<Form short_url={short_url} errors={errors} />);
  }

  if (!slug) {
    slug = nanoid();
    short_url.slug = slug;
  }
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

export default app;
