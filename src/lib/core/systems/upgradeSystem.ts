// systems/upgradeSystem.ts
import { gameState } from '../../state/gameState.svelte';
import { getUpgradeDefinition, upgradeDefinitions } from '$lib/core/managers/definitionMaps';
import type { EffectType, UpgradeEffect } from '$lib/types/upgrade';
import { effectHandlers } from './effectSystem';
import { upgradeTags, hasTag } from '$lib/core/systems/tagSystem';

export function isBasicUpgrade(upgradeId: string): boolean {
	return hasTag(upgradeTags, 'basic', upgradeId);
}

function calculateExponentialCost(baseCost: number, growthRate: number, amount: number): number {
	return baseCost * Math.pow(growthRate, amount);
}

export function getEffectiveMaxPurchases(upgradeId: string): number {
	const definition = getUpgradeDefinition(upgradeId);
	const state = gameState.upgrades[upgradeId];
	return definition.maxPurchases + state.bonusMaxPurchases;
}

function applyUpgradeEffects(upgradeId: string) {
	const definition = getUpgradeDefinition(upgradeId);

	definition.effects.forEach((effect) => {
		const handler = effectHandlers[effect.type];
		if (handler) {
			handler(effect.target, effect.amount);
		} else {
			console.warn(`No handler found for effect type: ${effect.type}`);
		}
	});
}

export function canAffordUpgrade(upgradeId: string): boolean {
	const definition = getUpgradeDefinition(upgradeId);
	const upgrade = gameState.upgrades[upgradeId];

	// If upgrade is maxed out, we can't afford it
	if (upgrade.purchased >= getEffectiveMaxPurchases(upgradeId)) {
		return false;
	}

	return Object.entries(upgrade.currentPrice).every(
		([resourceId, cost]) => gameState.resources[resourceId]?.amount >= cost
	);
}

export function purchaseUpgrade(upgradeId: string): boolean {
	const upgradeState = gameState.upgrades[upgradeId];
	const definition = getUpgradeDefinition(upgradeId);

	if (
		!canAffordUpgrade(upgradeId) ||
		upgradeState.purchased >= getEffectiveMaxPurchases(upgradeId)
	) {
		return false;
	}

	// Deduct current prices
	Object.entries(upgradeState.currentPrice).forEach(([resourceId, cost]) => {
		gameState.resources[resourceId].amount -= cost;
	});

	// Calculate new prices using exponential scaling
	Object.entries(definition.price.resources).forEach(([resourceId, baseCost]) => {
		upgradeState.currentPrice[resourceId] = calculateExponentialCost(
			baseCost,
			definition.price.scaling,
			upgradeState.purchased + 1 // +1 because we just purchased it
		);
	});

	upgradeState.purchased++;
	applyUpgradeEffects(upgradeId);

	return true;
}

export function checkRequirements(
	requirements: Record<string, number>,
	upgradeId: string
): boolean {
	// If the upgrade has been purchased before, it should always be visible
	const upgradeState = gameState.upgrades[upgradeId];
	if (upgradeState && upgradeState.purchased > 0) {
		return true;
	}

	// Check resource requirements
	return Object.entries(requirements.resources).every(([resourceId, requirement]) => {
		const resource = gameState.resources[resourceId];
		if (!resource) return false;
		return resource.amount >= requirement;
	});
}

export function updateUpgradeVisibility() {
	for (const [upgradeId, upgradeState] of Object.entries(gameState.upgrades)) {
		const definition = getUpgradeDefinition(upgradeId);
		upgradeState.visible = checkRequirements(definition.requirements, upgradeId);
	}
}

// Optional: Helper function to get all visible upgrades
export function getVisibleUpgrades() {
	return Object.entries(gameState.upgrades)
		.filter(([_, state]) => state.visible)
		.map(([id]) => id);
}

// Optional: Helper function to get all available upgrades (visible and can afford)
export function getAvailableUpgrades() {
	return getVisibleUpgrades().filter((id) => canAffordUpgrade(id));
}

// Optional: Helper function to get upgrade progress
export function getUpgradeProgress(upgradeId: string) {
	const upgradeState = gameState.upgrades[upgradeId];
	const definition = getUpgradeDefinition(upgradeId);

	return {
		purchased: upgradeState.purchased,
		maxPurchases: definition.maxPurchases,
		progress: upgradeState.purchased / definition.maxPurchases
	};
}
