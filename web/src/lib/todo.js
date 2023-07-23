// TODO API URL
const baseUrl = 'http://localhost:8080/todo/';

/** Class representing a Todo */
export class TodoType {
	/**
	 * Create a Todo
	 * @param {number} id - Unique ID
	 * @param {string} body - Todo body
	 * @param {number} status - Todo status
	 */
	constructor(id, body, status) {
		this.id = id;
		this.body = body;
		this.status = status;
	}
}

export class TodoUtil {
	/**
	 *
	 * @param {*} svelteFetch - Optionally pass in Svelte's fetch function, see https://kit.svelte.dev/docs/load#making-fetch-requests
	 */
	constructor(svelteFetch) {
		this.fetch = svelteFetch || fetch;
	}

	async listTodos() {
		const response = await this.httpGet();
		return {
			todoList: response.todo.map((todo) => new TodoType(todo.id, todo.body, todo.status)),
			doneList: response.done.map((todo) => new TodoType(todo.id, todo.body, todo.status))
		};
	}

	/**
	 * @param {string} body
	 */
	async createTodo(body) {
		return await this.httpRequest('POST', '', { body: body });
	}

	/**
	 * @param {number} id
	 * @param {number} status
	 */
	async updateTodo(id, status) {
		return await this.httpRequest('PUT', `${id}`, { status: status });
	}

	/**
	 * @param {number} id
	 */
	async deleteTodo(id) {
		return await this.httpRequest('DELETE', `${id}`);
	}

	async httpGet(path = '') {
		const response = await this.fetch(`${baseUrl}${path}`);
		return response.json();
	}

	async httpRequest(method = '', path = '', data = {}) {
		const url = `${baseUrl}${path}`;

		const response = await this.fetch(url, {
			method: method,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return response.json();
	}
}
