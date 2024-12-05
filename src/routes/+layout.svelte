<script lang="ts">
	import '../app.css';
	import { metadata } from '$lib/data/config.json';
	let { children } = $props();
</script>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>

<main class="bg-slate-100 dark:bg-slate-800 w-screen h-screen">
	{@render children()}
</main>