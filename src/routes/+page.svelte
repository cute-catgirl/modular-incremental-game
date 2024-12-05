<script lang="ts">
	import { gameState } from '$lib/state/gameState.svelte';
	import ResourceDisplay from '$lib/components/ResourceDisplay.svelte';
	import { onMount, onDestroy } from 'svelte';
	import UpgradeDisplay from '$lib/components/UpgradeDisplay.svelte';
	import { initializeGame, stopGameLoop } from '$lib/core/engine';
	import { updateResources } from '$lib/core/systems/resourceSystem';
	import { purchaseUpgrade } from '$lib/core/systems/upgradeSystem';
    import { mainResourceID } from '$lib/data/config.json';
    import { getUpgradeDefinition } from '$lib/core/managers/definitionMaps';
    
    let hasLoaded = false;

    onDestroy(() => {
        stopGameLoop();
    });

	onMount(async () => {
		await initializeGame().then(() => {
            hasLoaded = true;
            console.log(gameState.upgrades);
        });
	});

    function handleUpgradePurchase(upgradeId: string) {
        purchaseUpgrade(upgradeId);
    }
</script>

<!-- wait for game to initialize -->
{#if hasLoaded}
    <div class="container mx-auto p-4 flex flex-col gap-2 justify-center items-center select-none">
        <ResourceDisplay id={mainResourceID} state={gameState.resources[mainResourceID]} />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each Object.entries(gameState.upgrades)
                .sort(([idA], [idB]) => {
                    const defA = getUpgradeDefinition(idA);
                    const defB = getUpgradeDefinition(idB);
                    return defA.index - defB.index;
                }) as [id, state]}
                {#if state.visible}
                    <UpgradeDisplay 
                        {id}
                        upgradeState={state}
                        onPurchase={handleUpgradePurchase}
                    />
                {/if}
            {/each}
        </div>
    </div>
{/if}