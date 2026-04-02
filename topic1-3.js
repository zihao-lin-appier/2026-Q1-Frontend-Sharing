const url = new URL(
  "https://example.com/id436?a=${partner_ul}&b=${campaign_name}",
);

console.log("Before:", url.toString());

url.searchParams.append("c", "extra_param");

console.log("After append:", url.toString());
