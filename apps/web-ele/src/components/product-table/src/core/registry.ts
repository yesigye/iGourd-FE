import type { ModePlugin } from '../types';

const REGISTRY = new Map<string, ModePlugin>();

export function registerMode(plugin: ModePlugin) {
  REGISTRY.set(plugin.id, plugin);
}

export function getMode(id: string): ModePlugin | undefined {
  return REGISTRY.get(id);
}
