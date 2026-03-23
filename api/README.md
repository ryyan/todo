# TODO API

A high-performance, zero-dependency backend built with [Bun](https://bun.sh/).

## Features

- **Runtime:** Bun
- **Database:** Native `bun:sqlite`
- **Routing:** Modern `URLPattern` Web Standard
- **Design:** Dependency-free, pure Bun standard library

## Development

Install dependencies:
```bash
bun install
```

Start the server:
```bash
bun start
```

The server runs on [http://localhost:8080](http://localhost:8080).

## Implementation Details

The API uses pre-compiled SQL statements and native Web APIs for maximum performance and minimal memory footprint. All logic resides in `main.ts`.
