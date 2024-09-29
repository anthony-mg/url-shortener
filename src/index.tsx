import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { serveStatic } from "hono/bun";
import { Renderer, Form, Confirmed } from "./components/components";
import { customAlphabet } from "nanoid";
import { createURL, getURL } from "@/db/url";
import { ShortUrl } from "@/types/URL";
import { FormError } from "@/types/form";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);

const app = new Hono();

app.use(logger());
app.use("*", requestId({ limitLength: 1 }));
app.use("*", serveStatic({ root: "./static" }));
app.get("*", Renderer);

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
  const short_url: ShortUrl = { url, slug };
  let errors: FormError = {};
  if (!url) {
    errors.url = "Please provide a url";
    return c.html(<Form short_url={short_url} errors={errors} />);
  }
  if (!slug) {
    slug = nanoid();
  }
  try {
    createURL(url, slug);
  } catch (error) {
    errors = { slug: "slug in use, pick another" };
    return c.html(<Form short_url={short_url} errors={errors} />);
  }
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
