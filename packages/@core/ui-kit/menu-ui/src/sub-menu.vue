<script setup lang="ts">
import type { MenuRecordRaw } from '@igourd-core/typings';
import { isEmpty } from '@igourd-core/shared/utils';

import { computed } from 'vue';

import { MenuBadge, MenuItem, SubMenu as SubMenuComp } from './components';
// eslint-disable-next-line import/no-self-import
import SubMenu from './sub-menu.vue';
import { useMenuContext } from './hooks';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}

defineOptions({
  name: 'SubMenuUi',
});

const props = withDefaults(defineProps<Props>(), {});

/**
 * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
 */
const hasChildren = computed(() => {
  const { menu } = props;
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  );
});
const rootMenu = useMenuContext();
function hasSubGroup(menu?: MenuRecordRaw[]) {
  if (isEmpty(menu)) {
    return false;
  }
  return !menu!.some((item) => isEmpty(item.children));
}
</script>

<template>
  <MenuItem
    v-if="!hasChildren"
    :key="menu.path"
    :active-icon="menu.activeIcon"
    :badge="menu.badge"
    :badge-type="menu.badgeType"
    :badge-variants="menu.badgeVariants"
    :icon="menu.icon"
    :path="menu.path"
  >
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
  </MenuItem>
  <SubMenuComp
    v-else
    :key="`${menu.path}_sub`"
    :active-icon="menu.activeIcon"
    :icon="menu.icon"
    :path="menu.path"
  >
    <template #content>
      <MenuBadge
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
        class="right-6"
      />
    </template>
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
    <template v-if="rootMenu.props.popover">
      <template v-if="hasSubGroup(menu.children)">

      </template>
      <template
        v-else
        v-for="childItem in menu.children || []"
        :key="childItem.path"
      >
        <SubMenu :menu="childItem" />
      </template>
    </template>
    <template v-else>
      <template v-for="childItem in menu.children || []" :key="childItem.path">
        <SubMenu :menu="childItem" />
      </template>
    </template>
  </SubMenuComp>
</template>
