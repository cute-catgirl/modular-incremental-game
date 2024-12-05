import type { ResourceDefinition } from '$lib/types/resource';
import type { UpgradeDefinition } from '$lib/types/upgrade';

export const resourceDefinitions = new Map<string, ResourceDefinition>();
export const upgradeDefinitions = new Map<string, UpgradeDefinition>();

export function getResourceDefinition(id: string): ResourceDefinition {
	const definition = resourceDefinitions.get(id);
	if (!definition) {
		throw new Error(`Resource definition not found: ${id}`);
	}
	console.log(definition);
	return definition;
}

export function getUpgradeDefinition(id: string): UpgradeDefinition {
	const definition = upgradeDefinitions.get(id);
	if (!definition) {
		throw new Error(`Upgrade definition not found: ${id}`);
	}
	return definition;
}
