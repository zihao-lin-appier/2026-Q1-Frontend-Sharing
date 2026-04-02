const url = new URL(
  "https://example.com/id436?a=${partner_ul}&b=${campaign_name}",
);

console.log("Before:");
console.log(url.toString());

url.searchParams.delete("b");

console.log("After delete:");
console.log(url.toString());
