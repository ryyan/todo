<script>
	import TodoList from '$lib/TodoList.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<h1>TODO</h1>
	<TodoList todoList={data.todoList} doneList={data.doneList} />
</div>

<style>
	div {
		margin: auto;
		width: 50%;
		padding: 10px;
		text-align: justify;
	}
</style>
