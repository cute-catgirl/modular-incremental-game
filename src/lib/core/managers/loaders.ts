import { resourceDefinitions, upgradeDefinitions } from './definitionMaps';
import { gameState } from '$lib/state/gameState.svelte';
import { checkRequirements } from '$lib/core/systems/upgradeSystem';
import type { ResourceDefinition } from '$lib/types/resource';
import type { UpgradeDefinition } from '$lib/types/upgrade';

export async function loadGameDefinitions() {
    const resourceFiles = import.meta.glob('$lib/data/resources/*.json', { eager: true });
    const upgradeFiles = import.meta.glob('$lib/data/upgrades/*.json', { eager: true });
    
    // Load resource definitions...
    for (const [path, content] of Object.entries(resourceFiles)) {
        const id = path.split('/').pop()?.replace('.json', '') ?? '';
        const definition = {
            id,
            ...content as Omit<ResourceDefinition, 'id'>
        };
        
        // Store definition
        resourceDefinitions.set(id, definition);
        
        // Initialize state (only dynamic data)
        gameState.resources[id] = {
            amount: 0,
            baseRate: definition.baseRate,
            multiplier: 1
        };
    }
    // Load upgrade definitions...
    for (const [path, content] of Object.entries(upgradeFiles)) {
        const id = path.split('/').pop()?.replace('.json', '') ?? '';
        const definition = {
            id,
            ...content as UpgradeDefinition
        };
        
        // Store definition
        upgradeDefinitions.set(id, definition);
        
        // Initialize state (only dynamic data)
        gameState.upgrades[id] = {
            purchased: 0,
            visible: checkRequirements(definition.requirements, id),
            currentPrice: {...definition.price.resources},
            bonusMaxPurchases: 0
        };
    }

    console.log('State:', JSON.stringify(gameState));
}