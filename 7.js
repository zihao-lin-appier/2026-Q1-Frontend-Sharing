const macroUrl = "https://example.com/id436?a=${partner_ul}&b=${campaign_name}";

console.log("original:");
console.log(macroUrl);

console.log();

console.log("encodeURI:");
console.log(encodeURI(macroUrl));

console.log();

console.log("encodeURIComponent:");
console.log(encodeURIComponent(macroUrl));

console.log();

const value = "hello&world";

console.log('encodeURI("hello&world"):');
console.log(encodeURI(value));

console.log();

console.log('encodeURIComponent("hello&world"):');
console.log(encodeURIComponent(value));
