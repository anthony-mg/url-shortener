import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { renderer, Form, Confirmed } from "./components";
import { Database } from "bun:sqlite";
const app = new Hono();

app.use(logger());
app.use("*", requestId({ limitLength: 7 }));

app.get("*", renderer);

app.get("/", (c) => {
  return c.render(
    <div>
      <Form></Form>
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
  const slug = typeof body["slug"] === "string" ? body["slug"] : "";
  const final_url = `${url}/${slug}`;

  return c.html(<Confirmed url={final_url} />);

  //TODO: get form data, generate uuid, save short url to db
});

app.post("/url/validate", async (c) => {
  const body = await c.req.parseBody();

  //TODO: check db for
});

export default app;
