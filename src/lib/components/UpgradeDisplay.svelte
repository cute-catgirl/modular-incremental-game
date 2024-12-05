<!-- components/UpgradeDisplay.svelte -->
<script lang="ts">
	import { getResourceDefinition, getUpgradeDefinition } from '$lib/core/managers/definitionMaps';
	import { canAffordUpgrade, getEffectiveMaxPurchases } from '$lib/core/systems/upgradeSystem';
	import type { UpgradeState } from '$lib/types/upgrade';
	import { fade } from 'svelte/transition';
	import {
		autoUpdate,
		offset,
		flip,
		arrow,
		useFloating,
		FloatingArrow,
		useHover,
		useInteractions,
		useRole,
		useDismiss
	} from '@skeletonlabs/floating-ui-svelte';

	// State
	let open = $state(false);
	let elemArrow: HTMLElement | null = $state(null);

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => (open = v),
		placement: 'top',
		get middleware() {
			return [offset(10), flip(), elemArrow && arrow({ element: elemArrow })];
		}
	});

	// Interactions
	const role = useRole(floating.context, { role: 'tooltip' });
	const hover = useHover(floating.context, { move: false });
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, hover, dismiss]);

	const { id, upgradeState, onPurchase } = $props<{
		id: string;
		upgradeState: UpgradeState;
		onPurchase: (upgradeId: string) => void;
	}>();

	// Get the static definition data
	const definition = getUpgradeDefinition(id);

	function handleClick() {
		if (canAffordUpgrade(id)) {
			onPurchase(id);
		}
	}
</script>

<button
	class="flex aspect-square w-36 flex-col items-center justify-center
           rounded-lg border bg-white p-3
           shadow-sm transition-colors
           duration-200 hover:bg-gray-50
           disabled:cursor-not-allowed disabled:bg-gray-100
           dark:border-slate-600 dark:bg-slate-700
           dark:text-slate-100 dark:hover:bg-slate-600
           dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
	disabled={!canAffordUpgrade(id)}
	onclick={handleClick}
	bind:this={floating.elements.reference}
	{...interactions.getReferenceProps()}
>
	<h3 class="mb-2 text-center text-lg font-semibold dark:text-slate-100">
		{definition.name}
	</h3>

	<div class="w-full space-y-1">
		{#each Object.entries(upgradeState.currentPrice) as [resourceId, cost] (resourceId)}
			{@const resourceDef = getResourceDefinition(resourceId)}
			{#if upgradeState.purchased < getEffectiveMaxPurchases(id)}
				{#if resourceDef.icon.type == 'unicode'}
					<p class="text-center text-sm dark:text-slate-300">
						{resourceDef.icon.value}
						{(cost as number).toFixed(1)}
					</p>
				{:else}
					<p class="text-center text-sm dark:text-slate-300">
						{resourceDef.name}: {(cost as number).toFixed(1)}
					</p>
				{/if}
			{/if}
		{/each}
	</div>

	<p class="mt-2 text-sm text-gray-600 dark:text-slate-400">
		{upgradeState.purchased}/{definition.maxPurchases + upgradeState.bonusMaxPurchases}
	</p>
</button>
{#if open}
	<div
		bind:this={floating.elements.floating}
		style={floating.floatingStyles}
		{...interactions.getFloatingProps()}
		class="floating popover-neutral rounded-lg bg-white p-4 text-slate-700 shadow-lg dark:bg-slate-700 dark:text-white"
		transition:fade={{ duration: 200 }}
	>
		<p>
			{definition.description}
		</p>
		<FloatingArrow
			bind:ref={elemArrow}
			context={floating.context}
			class="fill-white dark:fill-slate-700"
		/>
	</div>
{/if}
