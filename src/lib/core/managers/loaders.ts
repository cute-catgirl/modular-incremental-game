import { resourceDefinitions, upgradeDefinitions } from './definitionMaps';
import { gameState } from '$lib/state/gameState.svelte';
import { checkRequirements } from '$lib/core/systems/upgradeSystem';
import type { ResourceDefinition } from '$lib/types/resource';
import type { UpgradeDefinition } from '$lib/types/upgrade';
import type { TagData } from '$lib/types/tags';
import { resourceTags, upgradeTags, loadTags } from '$lib/core/systems/tagSystem';

export async function loadGameDefinitions() {
	const resourceFiles = import.meta.glob('$lib/data/resources/*.json', { eager: true });
	const upgradeFiles = import.meta.glob('$lib/data/upgrades/*.json', { eager: true });

	// Load resource definitions...
	for (const [path, content] of Object.entries(resourceFiles)) {
		const id = path.split('/').pop()?.replace('.json', '') ?? '';
		const definition = {
			id,
			...(content as Omit<ResourceDefinition, 'id'>)
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
			...(content as UpgradeDefinition)
		};

		// Store definition
		upgradeDefinitions.set(id, definition);

		// Initialize state (only dynamic data)
		gameState.upgrades[id] = {
			purchased: 0,
			visible: checkRequirements(definition.requirements, id),
			currentPrice: { ...definition.price.resources },
			bonusMaxPurchases: 0
		};
	}
	// Load tags...
	const resourceTagFiles = import.meta.glob('$lib/data/tags/resources/*.json', { eager: true });
	const upgradeTagFiles = import.meta.glob('$lib/data/tags/upgrades/*.json', { eager: true });

	// Load resource tags
	for (const [path, content] of Object.entries(resourceTagFiles)) {
		const tagName = path.split('/').pop()?.replace('.json', '') ?? '';
		loadTags(resourceTags, { [tagName]: content as TagData });
	}

	// Load upgrade tags
	for (const [path, content] of Object.entries(upgradeTagFiles)) {
		const tagName = path.split('/').pop()?.replace('.json', '') ?? '';
		loadTags(upgradeTags, { [tagName]: content as TagData });
	}

	console.log('State:', JSON.stringify(gameState));
}
