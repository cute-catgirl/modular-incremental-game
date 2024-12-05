<script lang="ts">
	import '../app.css';
	import { metadata } from '$lib/data/config.json';
	let { children } = $props();
</script>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>

<main class="h-screen w-screen bg-slate-100 dark:bg-slate-800">
	{@render children()}
</main>
