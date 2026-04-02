const url = new URL(
  "https://example.com/id436?a=${partner_ul}&b=${campaign_name}",
);

console.log("original:");
console.log(url.toString());

console.log();

url.searchParams.set("b", "new_campaign");

console.log("get a after set:");
console.log(url.searchParams.get("a"));

console.log();

console.log("After set:");
console.log(url.toString());
