import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const DB_NAME = "todo.db";
const db = new DB(DB_NAME);

const PORT = 8080;

class Todo {
  id: number;
  body: string;
  status: number;
  ts: number;

  constructor(id: number, body: string, status: number, timestamp: number) {
    this.id = id;
    this.body = body;
    this.status = status;
    this.ts = timestamp;
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

  console.log("Setting up API");
  const app = new Application();

  // Set CORS headers
  app.use(async (ctx, next) => {
    await next();
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type",
    );
    ctx.response.headers.set(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS",
    );
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.addEventListener("error", (event: Deno.EventError) => {
    console.error(event.error);
  });

  console.log(`Starting server on port ${PORT}`);
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
    const body = params.body;
    ctx.response.body = createTodo(body);
  })
  .put("/todo/:id", async (ctx: Context) => {
    const formData = ctx.request.body();
    const params = await formData.value;
    const status = params.status;
    ctx.response.body = updateTodo(ctx.params.id, status);
  })
  .delete("/todo/:id", async (ctx: Context) => {
    ctx.response.body = deletetodo(ctx.params.id);
  });

function listTodos() {
  const todos = db.query("SELECT id, body, status, timestamp FROM todos;");

  let result: Todo[] = [];
  for (const todo of todos) {
    result.push(new Todo(todo[0], todo[1], todo[2], todo[3]));
  }

  return {
    "todo": result.filter((todo) => todo.status === 0),
    "done": result.filter((todo) => todo.status === 1),
  };
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

function updateTodo(id: number, status: number) {
  return db.query(
    "UPDATE todos SET status = :status WHERE id = :id;",
    [status, id],
  );
}

function deletetodo(id: number) {
  db.query("DELETE FROM todos WHERE id = :id;", [id]);
  return { deleted: db.changes };
}

main();
