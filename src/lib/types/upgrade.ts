export type EffectType = 'increase_gain' | 'multiply_gain' | 'increase_cap';

export interface UpgradeEffect {
	type: EffectType;
	target: string;
	amount: number;
}

export interface UpgradeDefinition {
	index: number;
	name: string;
	description: string;
	price: {
		resources: Record<string, number>;
		scaling: number;
	};
	effects: UpgradeEffect[]; // This now ensures effects must have valid effect types
	maxPurchases: number;
	requirements: Record<string, number>;
}

export interface UpgradeState {
	purchased: number;
	visible: boolean;
	currentPrice: Record<string, number>;
	bonusMaxPurchases: number;
}
