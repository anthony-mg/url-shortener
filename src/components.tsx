import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>

        <title>ANTSH - URLs but smaller</title>
      </head>
      <body>
        <main>${children}</main>
      </body>
    </html>
  `;
});

export const Form = () => (
  <form hx-post="/url" hx-swap="outerHTML">
    <label for="url">URL</label>
    <input placeholder="your long URL" type="text" name="url" id="url" />
    <label htmlFor="slug">slug /</label>
    <input type="text" name="slug" id="slug" placeholder="your cool slug" />
    <input type="submit" value="Submit" />
  </form>
);

export const Confirmed = ({ url }: { url: string }) => (
  <div>
    Success! Your short url is:
    <div>{url}</div>
  </div>
);
