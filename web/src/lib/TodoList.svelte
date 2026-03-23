<script>
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { TodoType, TodoUtil } from '$lib/todo.js';

	/** @typedef {{todoList: TodoType[], doneList: TodoType[]}} Props */
	/** @type {Props} */
	let { todoList = $bindable([]), doneList = $bindable([]) } = $props();

	const todoUtil = new TodoUtil();
	let newBody = $state('');

	const [send, receive] = crossfade({
		duration: 600,
		easing: quintOut,

		fallback(node, _params) {
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

	async function creatTodo() {
		console.log(`creatTodo body=${newBody}`);
		const newTodo = await todoUtil.createTodo(newBody);
		todoList = [...todoList, newTodo];
		newBody = ''; // Clear input
	}

	/**
	 * @param {TodoType} todo
	 */
	async function updateStatusToDone(todo) {
		console.log(`updateStatusToDone: todo=${todo.id}`);
		await todoUtil.updateTodo(todo.id, 1);

		// Remove item from todo list
		todoList = todoList.filter((x) => x.id !== todo.id);

		// Add item to done list
		doneList = [...doneList, todo];
	}

	/**
	 * @param {TodoType} todo
	 */
	async function deleteTodo(todo) {
		console.log(`deleteTodo: todo=${todo.id}`);
		await todoUtil.deleteTodo(todo.id);

		// Remove item from done list
		doneList = doneList.filter((x) => x.id !== todo.id);
	}
</script>

<div>
	<button onclick={creatTodo}>➕</button>
	<input bind:value={newBody} />
</div>

{#each todoList as todo (todo.id)}
	<div in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip>
		<button onclick={() => updateStatusToDone(todo)}>✔️</button>
		{todo.body}
	</div>
{/each}

{#each doneList as todo (todo.id)}
	<div in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip class="done">
		<button onclick={() => deleteTodo(todo)}>🗑️</button>
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
