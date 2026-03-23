# TODO Web UI

A modern, reactive user interface built with [Svelte 5](https://svelte.dev/).

## Features

- **Framework:** Svelte 5 + SvelteKit
- **Styling:** Vanilla CSS
- **State Management:** Svelte Runes (`$state`, `$props`, `$bindable`)
- **Animations:** Svelte Transitions & FLIP animations

## Development

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

## Modern Architecture

This project uses the latest Svelte 5 paradigms, including:

- **Runes:** For granular and efficient reactivity.
- **Event Attributes:** Standard `onclick` instead of `on:click`.
- **Props:** Structured `$props()` for better type safety and clarity.
