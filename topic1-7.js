const macroUrl = "https://example.com/id436?a=${partner_ul}&b=${campaign_name}";

console.log("encodeURI:");
console.log(encodeURI(macroUrl));

console.log();

console.log("encodeURIComponent:");
console.log(encodeURIComponent(macroUrl));

console.log();

const value = "hello&world";
console.log('encodeURI("hello&world"):', encodeURI(value));
console.log('encodeURIComponent("hello&world"):', encodeURIComponent(value));
