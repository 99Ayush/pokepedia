<div align="center">

# 🔴 Pokepedia

**A complete Pokédex in three files — no framework, no bundler, no dependencies.**

[![Live Demo](https://img.shields.io/badge/live-demo-f23c2f?style=for-the-badge&logo=vercel&logoColor=white)](https://pokepedia-tan.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-2ea44f?style=for-the-badge)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/vanilla-JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Powered by PokeAPI](https://img.shields.io/badge/data-PokeAPI-3b4cca?style=for-the-badge)](https://pokeapi.co)

[Live app](https://pokepedia-tan.vercel.app) · [Report a bug](https://github.com/99Ayush/pokepedia/issues)

</div>

---

Pokepedia is a browser Pokédex built on **raw DOM APIs and the PokeAPI**. Frameworks hide exactly the parts that break in production — request orchestration, list rendering, modal state, and what happens when a user types faster than the network replies. Building it by hand was the point.

The whole application is `index.html`, `pokedex.css`, and `pokedex.js`.

## Features

| Feature | What it does |
| :--- | :--- |
| **Generation browsing** | Nine quick-jump buttons load every Pokémon from Gen 1 through Gen 9 in one batched request pass |
| **Global search** | Fetches the full Pokémon index once at startup, then resolves only the closest name matches on each keystroke |
| **Items Bag** | Switches the entire grid into item mode, searching and rendering items from the same API |
| **Shiny mode** | Toggles every sprite — grid and modal — to its shiny artwork in one render pass |
| **Detail modal** | Official artwork, height and weight, base stats as proportional bars, and the full evolution chain |
| **Cry playback** | Streams the Pokémon's cry from the API through a single `Audio` instance |
| **Responsive layout** | One grid that reflows from desktop to phone with no CSS framework |

## How it works

```text
app boot
   │
   ├── prefetch name index ─────────────► /pokemon?limit=10000
   │
   ├── generation button ───────────────► 1 fetch per Pokémon in range (batched with Promise.all)
   │
   ├── keystroke ───────────────────────► filter local index → resolve top 10 → render
   │
   └── card click ──────────────────────► detail fetch → stats, evolution chain, cry
```

Two details worth calling out:

- **The name index is loaded once**, not per keystroke. Typing filters an in-memory array and only the top ten matches hit the network.
- **Detail views fetch independently of the grid**, so opening a Pokémon never re-downloads the list.

## Project layout

```text
pokepedia/
├── index.html     Markup, generation controls, modal shell
├── pokedex.css    Design tokens, card grid, modal, responsive rules
├── pokedex.js     Data layer, search, rendering, modal, items, shiny state
└── LICENSE
```

There is no `package.json` and no build step. `pokedex.js` is loaded with a cache-busting query string so a deploy always ships the new bundle.

## Run locally

Any static file server works:

```bash
git clone https://github.com/99Ayush/pokepedia.git
cd pokepedia
npx serve .
```

Or skip the server entirely and open `index.html` — it is a single page talking to a public API. No API key, no environment variables, no install.

## Notes and limits

- Data comes live from [PokeAPI](https://pokeapi.co), so the app is only as fresh as their dataset.
- Generation ranges are hardcoded (`1–151`, `152–251`, …) because the API exposes ranges, not a generation field.
- Items Bag loads the first 100 items rather than paging the full catalogue — enough to demonstrate the mode without hammering the API.
- No offline cache. Reopening the tab re-fetches.

## License

[MIT](LICENSE) · built by [Ayush Kumar](https://github.com/99Ayush)
