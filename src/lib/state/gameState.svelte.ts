import type { ResourceState } from "$lib/types/resource";
import type { UpgradeState } from "$lib/types/upgrade";

export const gameState = $state({
    resources: {} as Record<string, ResourceState>,
    upgrades: {} as Record<string, UpgradeState>
});
