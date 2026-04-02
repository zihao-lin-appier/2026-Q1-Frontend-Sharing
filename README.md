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

This is the same reason why `new URL()` does not encode the input string.
