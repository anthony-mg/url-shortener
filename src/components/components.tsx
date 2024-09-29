import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";
import { ShortUrl } from "types/URL";
import { FormError } from "types/form";

export const Renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css" />
        <link rel="stylesheet" href="/styles.css" />
        <title>ANTSH - URLs but smaller</title>
      </head>
      <body>
        <main class="container">${children}</main>
      </body>
    </html>
  `;
});

export const Form = ({ short_url, errors }: { short_url: ShortUrl; errors: FormError }) => (
  <form hx-post="/url" hx-swap="outerHTML" id="form">
    <div>
      <label for="url">URL</label>
      <input
        autocomplete="off"
        aria-invalid={errors.url ? true : ""}
        placeholder="your long url"
        type="text"
        name="url"
        value={short_url.url}
      />
    </div>
    <div hx-target="form" hx-swap="outerHTML">
      <label label htmlFor="slug">
        slug /
      </label>
      <input
        autocomplete="off"
        aria-invalid={errors.slug ? true : ""}
        hx-post="/url/validate"
        type="text"
        name="slug"
        placeholder="your cool slug"
        value={short_url.slug}
      />
    </div>
    <div className={errors.url ? "pico-color-red-500" : ""}>{errors.url}</div>
    <div className={errors.slug ? "pico-color-red-500" : ""}>{errors.slug}</div>
    <input type="submit" value="Submit" />
  </form>
);

export const Confirmed = ({ short_url }: { short_url: ShortUrl }) => (
  <section>
    Success! Your short url is:
    <div>{short_url.url}</div>
  </section>
);
