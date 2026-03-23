import { Database } from 'bun:sqlite';

const PORT = parseInt(process.env.PORT || '8080', 10);
const DB_NAME = process.env.DB_NAME || 'todo.db';
const db = new Database(DB_NAME);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body TEXT NOT NULL,
    status INTEGER NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

type Todo = {
	id: number;
	body: string;
	status: number;
	timestamp: number;
};

// Pre-compiled SQL statements for maximum performance
const statements = {
	list: db.query<Todo, []>('SELECT * FROM todos;'),
	get: db.query<Todo, { $id: number }>('SELECT * FROM todos WHERE id = $id;'),
	insert: db.prepare<Todo, { $body: string }>(
		'INSERT INTO todos (body, status) VALUES ($body, 0) RETURNING id, body, status, timestamp;'
	),
	update: db.prepare<Todo, { $status: number; $id: number }>(
		'UPDATE todos SET status = $status WHERE id = $id RETURNING id, body, status, timestamp;'
	),
	delete: db.prepare<{ id: number }, { $id: number }>('DELETE FROM todos WHERE id = $id RETURNING id;')
};

// Production-ready security and CORS headers
const SECURITY_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const ROUTES = {
	LIST: new URLPattern({ pathname: '/todo{/}?' }),
	ITEM: new URLPattern({ pathname: '/todo/:id{/}?' })
};

/**
 * Route Handlers
 */

function listTodos() {
	const todos = statements.list.all();
	return Response.json(
		{
			todo: todos.filter((t) => t.status === 0),
			done: todos.filter((t) => t.status === 1)
		},
		{ headers: SECURITY_HEADERS }
	);
}

async function createTodo(req: Request) {
	const { body } = await req.json();
	if (!body) {
		return new Response(JSON.stringify({ error: 'Body required' }), {
			status: 400,
			headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
		});
	}
	const todo = statements.insert.get({ $body: body });
	return Response.json(todo, { headers: SECURITY_HEADERS });
}

function getTodo(id: number) {
	const todo = statements.get.get({ $id: id });
	return todo
		? Response.json(todo, { headers: SECURITY_HEADERS })
		: new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
			});
}

async function updateTodo(id: number, req: Request) {
	const { status } = await req.json();
	const todo = statements.update.get({ $status: status, $id: id });
	return todo
		? Response.json(todo, { headers: SECURITY_HEADERS })
		: new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
			});
}

function deleteTodo(id: number) {
	const result = statements.delete.get({ $id: id });
	return Response.json({ deleted: result ? 1 : 0 }, { headers: SECURITY_HEADERS });
}

/**
 * Main Server Export
 */

export default {
	port: PORT,
	hostname: '0.0.0.0',
	async fetch(req: Request) {
		const url = new URL(req.url);
		const method = req.method;

		// 1. CORS Preflight
		if (method === 'OPTIONS') {
			return new Response(null, { headers: SECURITY_HEADERS });
		}

		try {
			// 2. Collection Routing (/todo)
			if (ROUTES.LIST.test(url)) {
				if (method === 'GET') return listTodos();
				if (method === 'POST') return createTodo(req);
			}

			// 3. Item Routing (/todo/:id)
			const itemMatch = ROUTES.ITEM.exec(url);
			if (itemMatch) {
				const id = parseInt(itemMatch.pathname.groups.id!, 10);
				if (method === 'GET') return getTodo(id);
				if (method === 'PUT') return updateTodo(id, req);
				if (method === 'DELETE') return deleteTodo(id);
			}

			// 4. Default Not Found
			return new Response(JSON.stringify({ error: 'Not Found' }), {
				status: 404,
				headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
			});
		} catch (e) {
			console.error(`Request error: ${method} ${url.pathname}`, e);
			return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
				status: 500,
				headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
			});
		}
	},

	error(err: Error) {
		console.error('Global Server Error:', err);
		return new Response(JSON.stringify({ error: 'Fatal Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

console.log(`🚀 Todo API started on http://localhost:${PORT}`);
