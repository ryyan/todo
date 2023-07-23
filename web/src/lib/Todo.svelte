<script>
	import { createEventDispatcher } from 'svelte';
	import { TodoType } from '$lib/todo.js';

	/** @type {TodoType} */
	export let todo;

	// https://svelte.dev/tutorial/component-events
	const dispatch = createEventDispatcher();

	const updateStatusEmoji = todo.status === 0 ? '✔️' : '🗑️';

	function updateStatus() {
		dispatch('updateStatus', {
			todo: todo
		});
	}
</script>

<div>
	<button on:click={updateStatus}>{updateStatusEmoji}</button>
	{todo.body}
</div>
