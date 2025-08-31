import type { Component, VNode } from 'vue';

export type SlotTypes =
  | ((props: Record<string, any>) => VNode | VNode[])
  | Component
  | number
  | string
  | VNode;
