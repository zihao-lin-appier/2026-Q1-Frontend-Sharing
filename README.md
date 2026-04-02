# 2026 Q1 Frontend Sharing

## Outline

1. Topic 1 - URL search params
2. Topic 2 -
3. Topic 2 -

---

## Topic 1 - URL search params

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

| API                  | Direction | Assumes input is |
| -------------------- | --------- | ---------------- |
| `encodeURI`          | Encode    | Full URL         |
| `encodeURIComponent` | Encode    | Single component |
| `decodeURI`          | Decode    | Full URL         |
| `decodeURIComponent` | Decode    | Single component |

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

#### Approach 2: Placeholder swap

Replace macros with safe placeholders before mutation, then restore them after.

```js
const raw = "https://example.com/id436?a=${partner_ul}&b=${campaign_name}";

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
// "https://example.com/id436?a=__MACRO_0__&b=__MACRO_1__"

url.searchParams.set("c", "extra_param");
url.searchParams.delete("b");

// Step 3: Restore macros
let final = url.toString();
for (const [key, value] of Object.entries(macros)) {
  final = final.replace(key, value);
}

// "https://example.com/id436?a=${partner_ul}&c=extra_param"
```
