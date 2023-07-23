<script>
	import Todo from '$lib/Todo.svelte';
	import { TodoType, TodoUtil } from '$lib/todo.js';

	/** @type {Array.<TodoType>} */
	export let todoList;

	/** @type {Array.<TodoType>} */
	export let doneList;

	const todoUtil = new TodoUtil();
	let newBody = '';

	async function creatTodo(event) {
		console.log(`creatTodo body=${newBody}`);
		const newTodo = await todoUtil.createTodo(newBody);

		// Have to use [...doneList, ...] instead of donelist.push() to trigger Svelte's reactivity
		// https://learn.svelte.dev/tutorial/updating-arrays-and-objects
		todoList = [...todoList, newTodo];
	}

	async function updateStatusToDone(event) {
		const todoId = event.detail.todo.id;
		console.log(`updateStatusToDone: todoId=${todoId}`);
		await todoUtil.updateTodo(todoId, 1);

		// Remove item from todo list
		todoList = todoList.filter((todo) => todo.id !== todoId);

		// Add item to done list
		event.detail.todo.status = 1;
		doneList = [...doneList, event.detail.todo];
	}

	async function deleteTodo(event) {
		const todoId = event.detail.todo.id;
		console.log(`deleteTodo: todoId=${todoId}`);
		await todoUtil.deleteTodo(todoId);

		// Remove item from done list
		doneList = doneList.filter((todo) => todo.id !== todoId);
	}
</script>

<div>
	<button on:click={creatTodo}>➕</button>
	<input bind:value={newBody} />
</div>

{#each todoList as todo}
	<Todo {todo} on:updateStatus={updateStatusToDone} />
{/each}

{#each doneList as todo}
	<Todo {todo} on:updateStatus={deleteTodo} />
{/each}
