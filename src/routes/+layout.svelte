<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>click</title>
</svelte:head>

<main class="bg-slate-100 dark:bg-slate-800 w-screen h-screen">
	{@render children()}
</main>