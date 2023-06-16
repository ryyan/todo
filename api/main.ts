import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const DB_NAME = "todo.db";
const db = new DB(DB_NAME);

const PORT = 8080;

const NumToTask = {
  0: "Do",
  1: "Doing",
  2: "Done",
};

class Task {
  id: number;
  note: string;
  status: string;
  timestamp: number;

  constructor(id: number, note: string, status: number, timestamp: number) {
    this.id = id;
    this.note = note;
    this.status = NumToTask[status];
    this.timestamp = timestamp;
  }
}

async function main() {
  console.log(`Initializing database ${DB_NAME}`);
  db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note TEXT NOT NULL,
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
  .get("/task", async (ctx: Context) => {
    ctx.response.body = getTasks();
  })
  .get("/task/:id", async (ctx: Context) => {
    ctx.response.body = getTask(ctx.params.id);
  })
  .post("/task", async (ctx: Context) => {
    const formData = ctx.request.body();
    const params = await formData.value;
    const note = params.get("note");
    ctx.response.body = createTask(note);
  })
  .put("/task/:id", async (ctx: Context) => {
    const formData = ctx.request.body();
    const params = await formData.value;
    const note = params.get("note");
    const status = params.get("status");
    ctx.response.body = updateTask(ctx.params.id, note, status);
  })
  .delete("/task/:id", async (ctx: Context) => {
    ctx.response.body = deleteTask(ctx.params.id);
  });

function getTasks() {
  const tasks = db.query("SELECT * FROM tasks;");

  let result: Task[] = [];
  for (const task of tasks) {
    result.push(new Task(task[0], task[1], task[2], task[3]));
  }

  return result;
}

function getTask(id: number) {
  const tasks = db.query("SELECT * FROM tasks WHERE id = :id;", [id]);

  for (const task of tasks) {
    return new Task(task[0], task[1], task[2], task[3]);
  }
}

function createTask(note: string) {
  return db.query("INSERT INTO tasks (note, status) VALUES (?,?);", [note, 0]);
}

function updateTask(id: number, note: string, status: number) {
  return db.query(
    "UPDATE tasks SET note = :note, status = :status WHERE id = :id;",
    [note, status, id],
  );
}

function deleteTask(id: number) {
  return db.query("DELETE FROM tasks WHERE id = :id;", [id]);
}

main();
