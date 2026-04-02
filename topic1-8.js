const url = new URL(
  "https://example.com/id436?a=${partner_ul}&b=${campaign_name}",
);
url.searchParams.set("b", "new_campaign");

console.log("After set:", url.toString());

console.log("decodeURI:", decodeURI(url.toString()));
// ❌ %24{partner_ul} — $ (%24) is a URI reserved character, so decodeURI won't decode it.
//    Only { } are decoded because they are NOT reserved. The macro is still broken.
