import { TodoUtil } from '$lib/todo.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	return await new TodoUtil(fetch).listTodos();
}
