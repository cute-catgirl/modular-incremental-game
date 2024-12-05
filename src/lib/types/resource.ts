export interface ResourceDefinition {
    id: string;
    name: string;
    icon: {
        type: string;
        value: string;
    }
    baseRate: number;
}

export interface ResourceState {
    amount: number;
    baseRate: number;
    multiplier: number;
}