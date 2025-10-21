import type { ShallowRef } from 'vue';

import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';

import { inject, nextTick } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { pick } from '@igourd/utils';

import { basicsMerchantfind } from '@@/store/apis';

export function useStoreForm<
  T extends {
    setEditForm: (model: Record<string, any>) => unknown;
    submitForm: () => Promise<any>;
  },
>(storeFormRef: ShallowRef<null | T>) {
  const { t } = useI18n();
  const {
    currentLoginUserApp: { owner_id },
  } = useUserStore();

  function getDetail(id: string) {
    return basicsMerchantfind(id);
  }
  const { gridApi } = inject<{
    gridApi: ExtendedVxeGridApi;
  }>(Symbol.for('PageGrid'), {} as unknown as any);

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('store.store-list.edit-title'),
    class: 'w-[648px]',
    onOpenChange(isOpen) {
      if (!isOpen) {
        return;
      }
      drawerApi.lock();
      const id = drawerApi.getData()?.id;
      getDetail(id)
        .then((data) => {
          return nextTick(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const fileds = storeFormRef.value?.getFileds();
            const formData = pick(data, fileds);
            storeFormRef.value?.setEditForm({
              ...formData,
              sub_merchant_id: id,
              first_level_merchant_id: owner_id,
            });
          });
        })

        .finally(() => {
          drawerApi.unlock();
        });
    },
    onConfirm() {
      drawerApi.lock();
      storeFormRef.value
        ?.submitForm()
        .then(() => {
          drawerApi.close();
          gridApi.reload();
        })
        .finally(() => {
          drawerApi.unlock();
        });
    },
  });

  return {
    storeFormRef,
    Drawer,
    drawerApi,
  };
}
