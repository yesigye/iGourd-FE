<script setup lang="ts">
import type { MenuRecordRaw } from '@igourd-core/typings';
import { isEmpty } from '@igourd-core/shared/utils';

import { computed } from 'vue';

import { MenuBadge, MenuItem, SubMenu as SubMenuComp } from './components';
// eslint-disable-next-line import/no-self-import
import SubMenu from './sub-menu.vue';
import { useMenuContext } from './hooks';
import { IgourdIcon } from '@igourd-core/shadcn-ui';
import { useNamespace } from '@igourd-core/composables';

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

const nsMenu = useNamespace('menu');
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
      <div class="flex w-full items-center justify-between">
        <span>{{ menu.name }}</span>
        <IgourdIcon
          v-show="menu.parents"
          @click.stop="rootMenu.onToggleCollect(menu)"
          class="text-muted-foreground ml-1 size-5 cursor-pointer rounded-sm p-1"
          :class="{ 'text-warning': menu.collect_status === 'COLLECTED' }"
          icon="material-symbols:kid-star"
        />
      </div>
    </template>
  </MenuItem>
  <SubMenuComp
    v-else
    :key="`${menu.path}_sub`"
    :active-icon="menu.activeIcon"
    :icon="menu.icon"
    :path="menu.path"
    :hasSubGroup="hasSubGroup(menu.children)"
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
        <div class="flex w-fit flex-wrap gap-x-2 gap-y-1">
          <section
            v-for="(s, idx) in menu.children"
            :key="s?.path || s?.name || idx"
            class="w-fit min-w-[210px] flex-none p-1"
          >
            <div
              class="bg-primary-background-light mb-3 inline-flex w-full items-center gap-2 whitespace-nowrap rounded-md p-3 text-base font-medium"
            >
              <IgourdIcon
                :class="nsMenu.e('icon')"
                class="text-primary"
                :icon="s.icon"
              />
              <span class="text-primary select-none font-medium">
                {{ s.name }}
              </span>
            </div>

            <template
              v-for="childItem in s.children || []"
              :key="childItem.path"
            >
              <SubMenu :menu="childItem" />
            </template>
          </section>
        </div>
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
