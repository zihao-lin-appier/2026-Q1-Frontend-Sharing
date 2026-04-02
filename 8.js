const encodedUrl =
  "https://example.com/id436?a=%24%7Bpartner_ul%7D&b=%24%7Bcampaign_name%7D&c=hello%26world";

console.log("original:");
console.log(encodedUrl);

console.log();

console.log("decodeURI:");
console.log(decodeURI(encodedUrl));

console.log();

console.log("decodeURIComponent:");
console.log(decodeURIComponent(encodedUrl));

console.log();

const withEncodedAmp = "hello%26world";

console.log('decodeURI("hello%26world"):');
console.log(decodeURI(withEncodedAmp));

console.log();

console.log('decodeURIComponent("hello%26world"):');
console.log(decodeURIComponent(withEncodedAmp));
