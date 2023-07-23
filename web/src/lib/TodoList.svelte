<script>
	import { flip } from 'svelte/animate';
	import { quintIn, quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { TodoType, TodoUtil } from '$lib/todo.js';

	/** @type {Array.<TodoType>} */
	export let todoList;

	/** @type {Array.<TodoType>} */
	export let doneList;

	const todoUtil = new TodoUtil();
	let newBody = '';

	const [send, receive] = crossfade({
		duration: 600,
		easing: quintOut,

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	async function creatTodo(event) {
		console.log(`creatTodo body=${newBody}`);
		const newTodo = await todoUtil.createTodo(newBody);

		// Have to use [...doneList, ...] instead of donelist.push() to trigger Svelte's reactivity
		// https://learn.svelte.dev/tutorial/updating-arrays-and-objects
		todoList = [...todoList, newTodo];
	}

	async function updateStatusToDone(todo) {
		console.log(`updateStatusToDone: todo=${todo}`);
		await todoUtil.updateTodo(todo.id, 1);

		// Remove item from todo list
		todoList = todoList.filter((x) => x.id !== todo.id);

		// Add item to done list
		doneList = doneList.concat(todo);
	}

	async function deleteTodo(todo) {
		console.log(`deleteTodo: todo=${todo}`);
		await todoUtil.deleteTodo(todo.id);

		// Remove item from done list
		doneList = doneList.filter((x) => x.id !== todo.id);
	}
</script>

<div>
	<button on:click={creatTodo}>➕</button>
	<input bind:value={newBody} />
</div>

{#each todoList as todo (todo.id)}
	<div in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip>
		<button on:click={() => updateStatusToDone(todo)}>✔️</button>
		{todo.body}
	</div>
{/each}

{#each doneList as todo (todo.id)}
	<div in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip class="done">
		<button on:click={() => deleteTodo(todo)}>🗑️</button>
		{todo.body}
	</div>
{/each}

<style>
	div {
		padding-top: 4px;
		text-align: justify;
	}

	div.done {
		text-decoration: line-through;
	}
</style>
