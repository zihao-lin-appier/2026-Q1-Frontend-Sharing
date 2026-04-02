const url = new URL(
  "https://example.com/id436?b=${campaign_name}&a=${partner_ul}",
);

console.log("Before:", url.toString());

url.searchParams.sort();

console.log("After sort:", url.toString());
