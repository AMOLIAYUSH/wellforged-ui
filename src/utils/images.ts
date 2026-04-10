import type { SyntheticEvent } from "react";

export const DEFAULT_PRODUCT_IMAGE = "/Packaging_Updated.png";
export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const imageErrorFallback = (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = PLACEHOLDER_IMAGE;
};

const shouldBlockLocalhostImage = (value: string) => {
  // Block any dead dev-server images coming from localhost with random ports.
  // We keep this generic because ports can vary.
  const match = value.match(/^https?:\/\/(localhost|127\.0\.0\.1):(\d+)\//i);
  if (!match) return false;

  const port = Number(match[2]);
  // Never block current dev server origin or backend dev server.
  const currentPort = Number(window.location.port || "80");
  if (port === currentPort) return false;
  if (port === 5000) return false;

  // Only treat as "image URL" if it looks like an image file.
  return /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(value);
};

/**
 * Prevents the browser from ever requesting `http(s)://localhost:<port>/*.png`.
 * This is a last-resort guard for stale DB/cart data or any runtime injection.
 * It also logs a warning (with stack) so we can find the true source later.
 */
export const installLocalhostImageBlocker = () => {
  if (typeof window === "undefined") return;
  if ((window as any).__wfLocalhostImgBlockerInstalled) return;
  (window as any).__wfLocalhostImgBlockerInstalled = true;

  const proto = HTMLImageElement.prototype;

  const srcDescriptor = Object.getOwnPropertyDescriptor(proto, "src");
  if (srcDescriptor?.set && srcDescriptor.get) {
    Object.defineProperty(proto, "src", {
      configurable: true,
      enumerable: true,
      get: srcDescriptor.get,
      set: function (value: string) {
        if (typeof value === "string" && shouldBlockLocalhostImage(value)) {
          // Avoid noisy repeats per element.
          const el = this as HTMLImageElement;
          if (el.dataset.localhostBlocked !== "1") {
            el.dataset.localhostBlocked = "1";
            // Stack helps locate where the src is being set.
            // eslint-disable-next-line no-console
            console.warn("Blocked localhost image URL:", value, "\n", new Error().stack);
          }
          srcDescriptor.set!.call(this, PLACEHOLDER_IMAGE);
          return;
        }
        srcDescriptor.set!.call(this, value);
      },
    });
  }

  const originalSetAttribute = proto.setAttribute;
  proto.setAttribute = function (name: string, value: string) {
    if (name === "src" && typeof value === "string" && shouldBlockLocalhostImage(value)) {
      // eslint-disable-next-line no-console
      console.warn("Blocked localhost image URL via setAttribute:", value, "\n", new Error().stack);
      return originalSetAttribute.call(this, name, PLACEHOLDER_IMAGE);
    }
    return originalSetAttribute.call(this, name, value);
  };
};

/**
 * Blocks other ways of loading images that bypass `<img src=...>`:
 * - `fetch(url)` / `XMLHttpRequest` for image URLs
 * - `<link rel="preload" as="image" href="...">`
 */
export const installLocalhostImageRequestBlocker = () => {
  if (typeof window === "undefined") return;
  if ((window as any).__wfLocalhostImgRequestBlockerInstalled) return;
  (window as any).__wfLocalhostImgRequestBlockerInstalled = true;

  // fetch()
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;

    if (typeof url === "string" && shouldBlockLocalhostImage(url)) {
      // eslint-disable-next-line no-console
      console.warn("Blocked localhost image fetch:", url, "\n", new Error().stack);
      // Return an empty 204 response without hitting the network.
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return originalFetch(input as any, init);
  }) as any;

  // XHR
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) {
    const urlStr = typeof url === "string" ? url : url.toString();
    if (shouldBlockLocalhostImage(urlStr)) {
      // eslint-disable-next-line no-console
      console.warn("Blocked localhost image XHR:", urlStr, "\n", new Error().stack);
      // Point to a harmless URL (no request), then abort.
      originalXhrOpen.call(this, method, "about:blank", async ?? true, username ?? undefined, password ?? undefined);
      try { this.abort(); } catch { /* ignore */ }
      return;
    }
    return originalXhrOpen.call(this, method, url as any, async ?? true, username ?? undefined, password ?? undefined);
  } as any;

  // <link href=...> preload-as-image
  const linkProto = HTMLLinkElement.prototype as any;
  const hrefDesc = Object.getOwnPropertyDescriptor(linkProto, "href");
  if (hrefDesc?.set && hrefDesc.get) {
    Object.defineProperty(linkProto, "href", {
      configurable: true,
      enumerable: true,
      get: hrefDesc.get,
      set: function (value: string) {
        const rel = String((this as HTMLLinkElement).rel || "").toLowerCase();
        const asAttr = String((this as HTMLLinkElement).as || "").toLowerCase();
        if ((rel === "preload" && asAttr === "image") && typeof value === "string" && shouldBlockLocalhostImage(value)) {
          // eslint-disable-next-line no-console
          console.warn("Blocked localhost image preload:", value, "\n", new Error().stack);
          hrefDesc.set!.call(this, PLACEHOLDER_IMAGE);
          return;
        }
        hrefDesc.set!.call(this, value);
      },
    });
  }
};
