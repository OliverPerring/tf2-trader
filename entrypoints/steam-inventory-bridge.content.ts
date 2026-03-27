

export default defineContentScript({
  matches: [
    "*://steamcommunity.com/id/*/inventory*",
    "*://steamcommunity.com/profiles/*/inventory*",
    "*://steamcommunity.com/market/listings/440/*",
  ],
  runAt: "document_start",
  main() {
    window.addEventListener("message", (e: MessageEvent) => {
      if (e.source !== window) return;

      if (e.data?.type === "tf2trader_pricedb_request") {
        const { sku, id } = e.data as { sku: string; id: string };
        browser.runtime.sendMessage({ type: "pricedb_fetch", sku })
          .then((result) => window.postMessage({ type: "tf2trader_pricedb_response", id, result }, "*"))
          .catch(() => window.postMessage({ type: "tf2trader_pricedb_response", id, result: null }, "*"));
        return;
      }

      if (e.data?.type === "tf2trader_pricedb_search_request") {
        const { query, id } = e.data as { query: string; id: string };
        browser.runtime.sendMessage({ type: "pricedb_search", query })
          .then((result) => window.postMessage({ type: "tf2trader_pricedb_search_response", id, result }, "*"))
          .catch(() => window.postMessage({ type: "tf2trader_pricedb_search_response", id, result: null }, "*"));
      }
    });
  },
});
