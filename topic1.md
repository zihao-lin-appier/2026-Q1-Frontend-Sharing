# Topic 1 - URL search params

Take a look at:

```
${}
```

What does this make you think of?

**Macro !**

Macros are sometimes placed in the URL's search params:

```
https://example.com/id436?a=${partner_ul}&b=${campaign_name}
```

What happens when you try to access the URL using the URL object?

**Try it:**

1. `new URL()`

```bash
node topic1-1.js
```

2. `searchParams.set()`

```bash
node topic1-2.js
```

3. `searchParams.append()`

```bash
node topic1-3.js
```

4. `searchParams.delete()`

```bash
node topic1-4.js
```

5. `searchParams.sort()`

```bash
node topic1-5.js
```

6. `searchParams.get()`

```bash
node topic1-6.js
```

### Findings

- **`new URL()` alone is safe** — constructing a URL from a string with macros preserves them as-is, because the parser does not re-serialize the query string.
- **Any mutation triggers re-serialization** — `searchParams.set()`, `.append()`, `.delete()`, and `.sort()` all cause the entire query string to be re-encoded, turning `${macro}` into `%24%7Bmacro%7D`.
- **`searchParams.get()` is deceptive** — it always returns a percent-decoded value, so `${macro}` appears intact even after the URL has been corrupted. Always verify with `.toString()` or `.search` to see what actually gets sent.

---

### Why does this happen?

The `URL` object internally maintains two separate representations:

1. **The raw href string** — what you originally passed in. When you call `new URL(str)` without any further mutation, `toString()` returns this string largely as-is, so `${macro}` is preserved.
2. **The parsed `searchParams` object** — a live `URLSearchParams` instance that holds each key-value pair in decoded form. The moment you call any mutating method (`.set()`, `.append()`, `.delete()`, `.sort()`), the browser re-serializes **all** params from this internal parsed representation back into the href — and during that process every special character (`$`, `{`, `}`) gets percent-encoded.

`searchParams.get()` reads from the decoded internal representation, so it always returns the human-readable value regardless of what the actual href looks like. This makes it easy to miss the corruption.

Problem without encoding:

```js
url.searchParams.set("a", "hello&world");

// ?a=hello&world
```

This is interpreted as:

```js
{
  a: "hello",
  world: ""
}
```

But the intended meaning is:

```js
{
  a: "hello&world";
}
```

which should be encoded as:

```
https://example.com?a=hello%26world
```

---

### Similar APIs

The difference between these four APIs comes down to one question: are you encoding/decoding a **full URL**, or just a **part of it**?

| API                  | Direction | Assumes input is        |
| -------------------- | --------- | ----------------------- |
| `encodeURI`          | Encode    | Full URL                |
| `encodeURIComponent` | Encode    | Single component        |
| `decodeURI`          | Decode    | Full URL                |
| `decodeURIComponent` | Decode    | Single component        |

**Encoding**

- `encodeURI` does **not** encode URL-structural characters (`: / ? & = #`). It keeps the URL navigable but encodes `{ }` — partially breaking macros.
- `encodeURIComponent` encodes **almost everything**, including `& = ? /`. Safe for query values, but destroys a full URL if misused.

**Decoding**

- `decodeURI` does **not** decode characters that would break URL structure (`%26` stays `%26`). Note: `$` (`%24`) is a URI reserved character, so `decodeURI` won't decode it either — meaning it cannot fully restore a broken macro URL.
- `decodeURIComponent` decodes **everything** — use it only on individual values, not full URLs.

**Quick rule:** full URL → `encodeURI` / `decodeURI`. Component (query value, path segment) → `encodeURIComponent` / `decodeURIComponent`.

**Try it:**

7. `encodeURI` vs `encodeURIComponent`

```bash
node topic1-7.js
```

8. use `decodeURI` to recover the URL

```bash
node topic1-8.js
```

---

### How to preserve macros?

#### Approach 1: String concatenation

Perform all `searchParams` mutations on a separate instance, then concatenate the result onto the original URL string. The original macros are never parsed or re-serialized.

```js
const base = 'https://example.com/id436?a=${partner_ul}&b=${campaign_name}';

const extra = new URLSearchParams({ c: 'extra_param', d: 'another' });
const result = `${base}&${extra.toString()}`;

// "https://example.com/id436?a=${partner_ul}&b=${campaign_name}&c=extra_param&d=another"
// ✅ Original macros intact, new params safely encoded
```

Limitation: you can only **append** new params. You cannot modify or delete existing ones without risking the macros.

---

#### Approach 2: Placeholder swap

Replace macros with safe placeholders before mutation, then restore them after.

```js
const raw = 'https://example.com/id436?a=${partner_ul}&b=${campaign_name}';

// Step 1: Replace macros with placeholders
const macros = {};
let i = 0;
const safe = raw.replace(/\$\{[^}]+\}/g, (match) => {
  const key = `__MACRO_${i++}__`;
  macros[key] = match;
  return key;
});

// Step 2: Mutate freely
const url = new URL(safe);
console.log(url.toString());
// "https://example.com/id436?a=__MACRO_0__&b=__MACRO_1__"

url.searchParams.set('c', 'extra_param');
url.searchParams.delete('b');

// Step 3: Restore macros
let final = url.toString();
for (const [key, value] of Object.entries(macros)) {
  final = final.replace(key, value);
}

// "https://example.com/id436?a=${partner_ul}&c=extra_param"
// ✅ Macros preserved, and we were able to set/delete params
```

This approach supports **all** `searchParams` operations (set, append, delete, sort) while keeping macros safe.
