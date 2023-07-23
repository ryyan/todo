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

```sh
cd web
npm i
npm run
```

#### Example API Commands

Ran using [httpie](https://github.com/httpie/httpie)

```sh
# Create todo
$ http PUT localhost:8080/todo <<< '{"body": "Create TODO app"}'
```

```sh
# List todos
$ http localhost:8080/todo
{
    "done": [
        {
            "body": "Laundry",
            "id": 2,
            "status": 1,
            "ts": 1690074691
        }
    ],
    "todo": [
        {
            "body": "Create TODO app",
            "id": 1,
            "status": 0,
            "ts": 1690074605
        },
        {
            "body": "Dishes",
            "id": 3,
            "status": 0,
            "ts": 1690074694
        }
    ]
}
```

```sh
# Get todo
$ http localhost:8080/todo/1
{
    "body": "Create TODO app",
    "id": 1,
    "status": 0,
    "timestamp": 1690074605
}
```

```sh
# Update todo status to Done
$ http PUT localhost:8080/todo/1 <<< '{"status": 1}'
```

```sh
# Delete todo
$ http DELETE localhost:8080/todo/1
```
