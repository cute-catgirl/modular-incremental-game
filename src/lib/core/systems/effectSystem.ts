import { gameState } from '$lib/state/gameState.svelte';
import type { EffectType } from '$lib/types/upgrade';

export const effectHandlers = {
    increase_gain: (target: string, amount: number) => {
        const resource = gameState.resources[target];
        if (resource) {
            resource.baseRate += amount;
        }
    },
    multiply_gain: (target: string, amount: number) => {
        const resource = gameState.resources[target];
        if (resource) {
            resource.multiplier *= amount;
        }
    },
    increase_cap: (target: string, amount: number) => {
        const upgradeState = gameState.upgrades[target];
        if (upgradeState) {
            upgradeState.bonusMaxPurchases += amount;
        }
    }
} satisfies Record<EffectType, (target: string, amount: number) => void>;