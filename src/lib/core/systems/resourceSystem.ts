import { gameState } from '$lib/state/gameState.svelte';
import { resourceDefinitions } from '$lib/core/managers/definitionMaps';

export function calculateResourceProduction(resourceId: string): number {
	const resource = gameState.resources[resourceId];
	if (!resource) {
		console.error(`Resource not found: ${resourceId}`);
		return 0;
	}

	const definition = resourceDefinitions.get(resourceId);
	if (!definition) {
		console.error(`No definition found for resource: ${resourceId}`);
		return 0;
	}

	return resource.baseRate * resource.multiplier;
}

export function updateResources(deltaTime: number) {
	// We'll iterate through our resources using Object.entries so we have both id and state
	for (const [resourceId, resourceState] of Object.entries(gameState.resources)) {
		// Get the definition for this resource
		const definition = resourceDefinitions.get(resourceId);

		if (!definition) {
			// If we can't find the definition, log an error but continue processing other resources
			console.error(`No definition found for resource ${resourceId}`);
			continue;
		}

		resourceState.amount += calculateResourceProduction(resourceId) * deltaTime;

		// You might want to add additional features here, such as:
		// - Maximum resource caps
		// - Production multipliers
		// - Resource decay
		// - Resource dependencies (resources that require other resources to produce)
	}
}
