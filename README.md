# Pokepedia

**A Pokedex built in vanilla JavaScript — no framework, no build step, no shortcuts.**

> 🔗 **Live:** [pokepedia-tan.vercel.app](https://pokepedia-tan.vercel.app)

I built this deliberately without React. Frameworks hide the parts that break in production — DOM updates, request caching, race conditions between searches, and state that has to live in plain variables. Doing it by hand was the point.

---

## Features

- **Search** by name or Pokedex ID, with debounced input and stale-response guarding so fast typing never renders an old result.
- **Filters** by type, generation and held item.
- **Shiny mode** — swap every sprite to its shiny variant.
- **Sound effects** using the browser's audio API.
- **Detail views** — base stats rendered as bars, evolution chains, and Mega forms.
- **"Who's That Pokémon?"** — a guessing game built on the same data layer.
- **Client-side caching** so repeat views of the same Pokémon never re-hit the API.

---

## Architecture

Three concerns, kept separate on purpose:

```
index.html
├── css/          Layout, type-colour system, responsive grid
├── js/
│   ├── api.js      PokeAPI client: fetch, cache, normalise
│   ├── search.js   Debounce, filter state, render pipeline
│   ├── detail.js   Stats bars, evolution chain, forms
│   └── game.js     "Who's That Pokémon" state machine
└── assets/       Sprites and audio
```

The cache is a plain `Map` keyed by Pokémon identifier — the same object is reused for the grid, the detail modal and the guessing game, so a Pokémon is fetched at most once per session.

---

## Stack

- HTML5, CSS3 (custom properties for the type-colour system), ES6+ JavaScript
- [PokeAPI](https://pokeapi.co/) — no wrapper library

## Run locally

```bash
git clone https://github.com/99Ayush/pokepedia.git
cd pokepedia
npx serve .
```

No install step and no dependencies — open it and it works.

## License

MIT
