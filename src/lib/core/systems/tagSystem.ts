// src/lib/core/managers/tagManager.ts
import type { TagData } from '$lib/types/tags';
import type { TagMap } from '$lib/types/tags';

// Separate maps for different tag types
export const resourceTags: TagMap = new Map();
export const upgradeTags: TagMap = new Map();

export function addToTag(tagMap: TagMap, tag: string, value: string) {
	if (!tagMap.has(tag)) {
		tagMap.set(tag, new Set());
	}
	tagMap.get(tag)?.add(value);
}

export function removeFromTag(tagMap: TagMap, tag: string, value: string) {
	tagMap.get(tag)?.delete(value);
}

export function hasTag(tagMap: TagMap, tag: string, value: string): boolean {
	return tagMap.get(tag)?.has(value) ?? false;
}

export function getTagValues(tagMap: TagMap, tag: string): string[] {
	return Array.from(tagMap.get(tag) ?? []);
}

export function loadTags(tagMap: TagMap, tagData: Record<string, TagData>) {
	for (const [tag, data] of Object.entries(tagData)) {
		if (data.replace) {
			tagMap.set(tag, new Set(data.values));
		} else {
			data.values.forEach((value) => addToTag(tagMap, tag, value));
		}
	}
}
