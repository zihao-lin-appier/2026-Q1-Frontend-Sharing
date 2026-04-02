const url = new URL('https://example.com/id436?a=${partner_ul}&b=${campaign_name}');

console.log('get a:', url.searchParams.get('a'));

url.searchParams.set('b', 'new_campaign');

console.log('get a after set:', url.searchParams.get('a'));
console.log('After set:', url.toString());
