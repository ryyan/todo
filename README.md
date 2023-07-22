# TODO

## Getting Started

### Prereqs

- [Deno](https://deno.com/runtime)
- [Svelte](https://svelte.dev/)

### Run

```sh
cd api
deno task run
```

#### Example API Commands

Ran using [httpie](https://github.com/httpie/httpie)

```sh
# Create todo
$ http --form POST localhost:8080/todo note='Create TODO app'

# List todos
$ http localhost:8080/todo

# Get todo
$ http localhost:8080/todo/1
{
    "id": 1,
    "note": "Create TODO app",
    "status": "Do",
    "timestamp": 1687309658
}

# Update todo status with Doing/Done
$ http --form PUT localhost:8080/todo/1 note='Create TODO app' status=1
$ http --form PUT localhost:8080/todo/1 note='Create TODO app' status=2

# Delete todo
$ http DELETE localhost:8080/todo/1
```
