<!-- components/ResourceDisplay.svelte -->
<script lang="ts">
    import { getResourceDefinition } from "$lib/core/managers/definitionMaps";
	import { calculateResourceProduction } from "$lib/core/systems/resourceSystem";
	import type { ResourceState } from "$lib/types/resource";

    const { id, state } = $props<{
        id: string;
        state: ResourceState;
    }>();

    // floor to nearest tenth
    let amountRounded = $derived(Math.floor(state.amount * 10) / 10);

    // Get the static definition data
    const definition = getResourceDefinition(id);
    console.log(definition);
</script>

<div class="flex flex-col justify-center items-center">
    <p class="text-3xl tabular-nums text-slate-900 dark:text-white">
        {#if definition.icon.type == "unicode"}
            <span>{definition.icon.value}</span>
        {/if}
        {amountRounded.toFixed(1)}
    </p>
    <p class="text-sm text-slate-500 dark:text-slate-400">
        (+{calculateResourceProduction(id).toFixed(1)}/s)
    </p>
</div>