import { TodoUtil } from '$lib/todo.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	return await new TodoUtil(fetch).listTodos();
}
