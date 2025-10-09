<script setup lang="ts">
import type { Component } from 'vue';

import type { AnyFunction } from '@igourd/types';

import { computed, useTemplateRef, watch } from 'vue';

import { useIgourdModal } from '@igourd/common-ui';
import { useHoverToggle } from '@igourd/hooks';
import { LogOut } from '@igourd/icons';
import { $t } from '@igourd/locales';
import { preferences, usePreferences } from '@igourd/preferences';
import { isWindowsOs } from '@igourd/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  // 新增：Sub 相关
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  IgourdAvatar,
  IgourdIcon,
} from '@igourd-core/shadcn-ui';

import { useMagicKeys, whenever } from '@vueuse/core';

// import { LockScreenModal } from '../lock-screen';

type MenuChild = {
  disabled?: boolean;
  handler?: AnyFunction;
  icon?: Component | Function | string;
  shortcut?: string;
  text: string;
  value?: unknown;
};

type MenuItem = {
  children?: MenuChild[];
  disabled?: boolean;
  handler?: AnyFunction;
  icon?: Component | Function | string;
  shortcut?: string;
  text: string;
};

interface Props {
  /** 头像 */
  avatar?: string;
  /** 描述 */
  description?: string;
  /** 是否启用快捷键 */
  enableShortcutKey?: boolean;
  /** 菜单数组（支持二级） */
  menus?: MenuItem[];
  /** 标签文本 */
  tagText?: string;
  /** 文本 */
  text?: string;
  /** 触发方式 */
  trigger?: 'both' | 'click' | 'hover';
  /** hover触发时，延迟响应的时间 */
  hoverDelay?: number;
}

defineOptions({ name: 'UserDropdown' });

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  enableShortcutKey: true,
  menus: () => [],
  tagText: '',
  text: '',
  trigger: 'click',
  hoverDelay: 500,
});

// 事件：保持现有 logout，同时新增通用 select（用于 child.value）
const emit = defineEmits<{
  logout: [];
}>();

const { globalLogoutShortcutKey } = usePreferences();

// const [LockModal, lockModalApi] = useIgourdModal({ connectedComponent: LockScreenModal });
const [LogoutModal, logoutModalApi] = useIgourdModal({
  onConfirm() {
    handleSubmitLogout();
  },
});

const refTrigger = useTemplateRef('refTrigger');
const refContent = useTemplateRef('refContent');
const [openPopover, hoverWatcher] = useHoverToggle(
  [refTrigger, refContent],
  () => props.hoverDelay,
);

watch(
  () => props.trigger === 'hover' || props.trigger === 'both',
  (val) => (val ? hoverWatcher.enable() : hoverWatcher.disable()),
  { immediate: true },
);

const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'));
const enableLogoutShortcutKey = computed(
  () => props.enableShortcutKey && globalLogoutShortcutKey.value,
);
const enableShortcutKey = computed(
  () => props.enableShortcutKey && preferences.shortcutKeys.enable,
);

function handleLogout() {
  logoutModalApi.open();
  openPopover.value = false;
}

function handleSubmitLogout() {
  emit('logout');
  logoutModalApi.close();
}

// 统一处理“叶子项”点击：优先 handler；否则如果有 value，则发 select；最后关闭菜单
async function onLeafClick(
  item: { handler?: AnyFunction; value?: unknown },
  parent?: MenuItem,
) {
  if (typeof item.handler === 'function') {
    await item.handler();
  } else if (parent?.handler) {
    await parent?.handler(item);
  }
  openPopover.value = false;
}

if (enableShortcutKey.value) {
  const keys = useMagicKeys();
  whenever(keys['Alt+KeyQ']!, () => {
    if (enableLogoutShortcutKey.value) handleLogout();
  });
}
</script>

<template>
  <!-- <LockModal
    v-if="preferences.widget.lockScreen"
    :avatar="avatar"
    :text="text"
    @submit="handleSubmitLock"
  /> -->

  <LogoutModal
    :cancel-text="$t('common.cancel')"
    :confirm-text="$t('common.confirm')"
    :fullscreen-button="false"
    :title="$t('common.prompt')"
    centered
    content-class="px-8 min-h-10"
    footer-class="border-none mb-3 mr-3"
    header-class="border-none"
  >
    {{ $t('ui.widgets.logoutTip') }}
  </LogoutModal>

  <DropdownMenu v-model:open="openPopover">
    <DropdownMenuTrigger ref="refTrigger" :disabled="props.trigger === 'hover'">
      <div class="ml-1 mr-2 cursor-pointer rounded-full p-1.5">
        <div class="hover:text-accent-foreground flex-center">
          <IgourdAvatar :alt="text" :src="avatar" class="size-8" dot />
          <slot></slot>
        </div>
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="mr-2 min-w-[240px] p-0 pb-1">
      <div ref="refContent">
        <!-- <DropdownMenuSeparator v-if="menus?.length" /> -->

        <!-- 菜单区：自动识别是否有 children，决定渲染 Item 或 Sub -->
        <template v-for="menu in menus" :key="menu.text">
          <!-- 二级菜单 -->
          <DropdownMenuSub v-if="menu.children?.length">
            <DropdownMenuSubTrigger
              class="mx-1 flex w-full cursor-pointer items-center rounded-sm py-1 leading-8"
              :disabled="menu.disabled"
            >
              <IgourdIcon :icon="menu.icon" class="mr-2 size-4" />
              <span class="flex-1">{{ menu.text }}</span>
              <DropdownMenuShortcut v-if="menu.shortcut">
                {{ menu.shortcut }}
              </DropdownMenuShortcut>
            </DropdownMenuSubTrigger>
            <!-- 注意：这里不使用 Portal，避免 hover-toggle 因跨层导致根菜单提前关闭 -->
            <DropdownMenuSubContent class="min-w-[200px] p-0 pb-1">
              <DropdownMenuItem
                v-for="child in menu.children"
                :key="child.text"
                class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
                :disabled="child.disabled"
                @click="onLeafClick(child, menu)"
              >
                <IgourdIcon :icon="child.icon" class="mr-2 size-4" />
                <span class="flex-1">{{ child.text }}</span>
                <DropdownMenuShortcut v-if="child.shortcut">
                  {{ child.shortcut }}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <!-- 普通单项 -->
          <DropdownMenuItem
            v-else
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            :disabled="menu.disabled"
            @click="onLeafClick(menu)"
          >
            <IgourdIcon :icon="menu.icon" class="mr-2 size-4" />
            <span class="flex-1">{{ menu.text }}</span>
            <DropdownMenuShortcut v-if="menu.shortcut">
              {{ menu.shortcut }}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </template>

        <DropdownMenuSeparator />

        <DropdownMenuSeparator v-if="preferences.widget.lockScreen" />

        <DropdownMenuItem
          class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          @click="handleLogout"
        >
          <LogOut class="mr-2 size-4" />
          {{ $t('common.logout') }}
          <DropdownMenuShortcut v-if="enableLogoutShortcutKey">
            {{ altView }} Q
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
