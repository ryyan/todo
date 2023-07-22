import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const DB_NAME = "todo.db";
const db = new DB(DB_NAME);

const PORT = 8080;

const NumToStatus = {
  0: "Do",
  1: "Done",
};

class Todo {
  id: number;
  body: string;
  status: string;
  timestamp: number;

  constructor(id: number, body: string, status: number, timestamp: number) {
    this.id = id;
    this.body = body;
    this.status = NumToStatus[status];
    this.timestamp = timestamp;
  }
}

async function main() {
  console.log(`Initializing database ${DB_NAME}`);
  db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL,
      status INTEGER NOT NULL,
      timestamp INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  console.log(`Starting server on port ${PORT}`);
  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.addEventListener("error", (event: Deno.EventError) => {
    console.error(event.error);
  });
  await app.listen({ port: PORT });
}

const router = new Router();
router
  .get("/todo", async (ctx: Context) => {
    ctx.response.body = listTodos();
  })
  .get("/todo/:id", async (ctx: Context) => {
    ctx.response.body = getTodo(ctx.params.id);
  })
  .post("/todo", async (ctx: Context) => {
    const formData = ctx.request.body();
    const params = await formData.value;
    const body = params.get("body");
    ctx.response.body = createTodo(body);
  })
  .put("/todo/:id", async (ctx: Context) => {
    const formData = ctx.request.body();
    const params = await formData.value;
    const body = params.get("body");
    const status = params.get("status");
    ctx.response.body = updateTodo(ctx.params.id, body, status);
  })
  .delete("/todo/:id", async (ctx: Context) => {
    ctx.response.body = deletetodo(ctx.params.id);
  });

function listTodos() {
  const todos = db.query("SELECT * FROM todos;");

  let result: Todo[] = [];
  for (const todo of todos) {
    result.push(new Todo(todo[0], todo[1], todo[2], todo[3]));
  }

  return result;
}

function getTodo(id: number) {
  const todos = db.query("SELECT * FROM todos WHERE id = :id;", [id]);

  for (const todo of todos) {
    return new Todo(todo[0], todo[1], todo[2], todo[3]);
  }
}

function createTodo(body: string) {
  db.query("INSERT INTO todos (body, status) VALUES (?,?);", [body, 0]);
  return getTodo(db.lastInsertRowId);
}

function updateTodo(id: number, body: string, status: number) {
  return db.query(
    "UPDATE todos SET body = :body, status = :status WHERE id = :id;",
    [body, status, id],
  );
}

function deletetodo(id: number) {
  db.query("DELETE FROM todos WHERE id = :id;", [id]);
  return {deleted: db.changes};
}

main();
