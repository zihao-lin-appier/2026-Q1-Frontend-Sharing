const value = "hello world";

console.log("encodeURIComponent:");
console.log(encodeURIComponent(value));

console.log();

console.log("encodeURI:");
console.log(encodeURI(value));

console.log();

const params = new URLSearchParams({ q: value });

console.log("URLSearchParams:");
console.log(params.toString());
