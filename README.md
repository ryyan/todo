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
# Create task
$ http --form POST localhost:8080/task note='Create TODO app'

# Get tasks
$ http localhost:8080/task

# Get task
$ http localhost:8080/task/1
{
    "id": 1,
    "note": "Create TODO app",
    "status": "Do",
    "timestamp": 1687309658
}

# Update task status with Doing/Done
$ http --form PUT localhost:8080/task/1 note='Create TODO app' status=1
$ http --form PUT localhost:8080/task/1 note='Create TODO app' status=2

# Delete task
$ http DELETE localhost:8080/task/1
```
