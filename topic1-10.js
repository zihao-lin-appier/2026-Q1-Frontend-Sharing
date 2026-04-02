console.log("encodeURI:");
console.log(encodeURI("${macro}"));

console.log();

const url = new URL("https://example.com");
url.searchParams.set("a", "${macro}");

console.log("URLSearchParams:");
console.log(url.search);
