<script>
	import TodoList from '$lib/TodoList.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>TODO</h1>
<TodoList todoList={data.todoList} doneList={data.doneList} />
