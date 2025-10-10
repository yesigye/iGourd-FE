import type {
  DrawerInstance,
  DrawerProps,
  ReturnMethods,
  UseDrawerInnerReturnType,
  UseDrawerReturnType,
} from './typing';

import type { Fn, Nullable } from '#/common/typeing';

import {
  computed,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRaw,
  unref,
  watchEffect,
} from 'vue';

import { isEqual } from '@igourd/utils';

import { tryOnUnmounted } from '@vueuse/core';

import { isFunction } from '#/common/utils/is';

const dataTransferRef = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

/**
 * @deprecated import from 'igourd-ui';
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance())
    throw new Error(
      'useDrawer() can only be used inside setup() or functional components!',
    );

  const drawer = ref<DrawerInstance | null>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<number>(0);

  function register(drawerInstance: DrawerInstance, uuid: number) {
    tryOnUnmounted(() => {
      drawer.value = null;
      loaded.value = null;
      dataTransferRef[unref(uid)] = null;
    });

    if (unref(loaded) && drawerInstance === unref(drawer)) return;

    uid.value = uuid;
    drawer.value = drawerInstance;
    loaded.value = true;

    drawerInstance.emitOpen = (open: boolean, uid: number) => {
      openData[uid] = open;
    };
  }

  const getInstance = () => {
    const instance = unref(drawer);
    if (!instance) console.error('useDrawer instance is undefined!');

    return instance;
  };

  const methods: ReturnMethods = {
    getDrawerProps() {
      return getInstance()?.getDrawerProps() as any;
    },
    setDrawerProps: (props: Partial<DrawerProps>) => {
      getInstance()?.setDrawerProps(props);
    },

    getOpen: computed((): boolean => {
      return openData[Math.trunc(unref(uid))];
    }),

    openDrawer: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setDrawerProps({
        open,
      });
      if (!data) return;

      if (openOnSet) {
        dataTransferRef[unref(uid)] = null;
        dataTransferRef[unref(uid)] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
      if (!equal) dataTransferRef[unref(uid)] = toRaw(data);
    },
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ open: false });
    },
  };

  return [register, methods];
}

/**
 * @deprecated import from 'igourd-ui';
 */
export function useDrawerInner(callbackFn?: Fn): UseDrawerInnerReturnType {
  const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number>(0);

  if (!getCurrentInstance())
    throw new Error(
      'useDrawerInner() can only be used inside setup() or functional components!',
    );

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      console.error('useDrawerInner instance is undefined!');
      return;
    }
    return instance;
  };

  const register = (modalInstance: DrawerInstance, uuid: number) => {
    tryOnUnmounted(() => {
      drawerInstanceRef.value = null;
    });

    uidRef.value = uuid;
    drawerInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
      getDrawerProps() {
        return getInstance()?.getDrawerProps() as any;
      },
      changeLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ confirmLoading: loading });
      },
      getOpen: computed((): boolean => {
        return openData[Math.trunc(unref(uidRef))];
      }),

      closeDrawer: () => {
        getInstance()?.setDrawerProps({ open: false });
      },

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance()?.setDrawerProps(props);
      },
    },
  ];
}
