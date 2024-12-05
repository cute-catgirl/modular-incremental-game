export interface TagData {
	values: string[];
	replace?: boolean; // If true, replaces existing tags instead of merging
}

export type TagMap = Map<string, Set<string>>;
