import type { Component } from 'vue';

const formComponents: Record<string, Component> = {};

export function setFormComponents(components: Record<string, Component>) {
  Object.assign(formComponents, components);
}

export function getFormComponents() {
  return formComponents;
}
