import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";
import { ShortUrl } from "types/URL";
import { FormError } from "types/form";

export const Renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css" />
        <link rel="stylesheet" href="/styles/styles.css" />
        <title>ANTSH - URLs but shorter</title>
      </head>
      <body>
        <div class="flex">
          <h2>ANTSH -- Shorter URLs</h2>
          <div hx-target="this" hx-swap="innerHTML" class="container">${children}</div>
        </div>
      </body>
    </html>
  `;
});

export const Form = ({ short_url, errors }: { short_url: ShortUrl; errors: FormError }) => (
  <form hx-post="/url" id="form">
    <input
      autocomplete="off"
      aria-invalid={errors.url ? true : ""}
      placeholder="your long url"
      type="text"
      name="url"
      value={short_url.url}
    />
    <input
      autocomplete="off"
      aria-invalid={errors.slug ? true : ""}
      type="text"
      name="slug"
      placeholder="your cool /slug (Ex: cool --> antsh.one/cool)"
      value={short_url.slug}
    />

    <div className={errors.url ? "pico-color-red-500" : ""}>{errors.url}</div>
    <div className={errors.slug ? "pico-color-red-500" : ""}>{errors.slug}</div>
    <input type="submit" value="Submit" />
  </form>
);

export const Confirmed = ({ short_url }: { short_url: ShortUrl }) => (
  <section class="flex">
    Success! Your short url is:
    <button class="item outline secondary">antsh.one/{short_url.slug}</button>
  </section>
);

export const Error = ({ message = "" }: { message: string }) => (
  <div>
    <div class="flex">{message}</div>
  </div>
);
