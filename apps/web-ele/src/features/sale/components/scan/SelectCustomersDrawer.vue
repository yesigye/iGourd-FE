<script setup>
import { computed, ref } from 'vue';

import { ElButton, ElInput, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { debounce } from '@igourd/utils';

import { getCustomerPageListApi } from '@@/customer/apis';
import { storeToRefs } from 'pinia';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useCustomerStore } from '#/store/sale/customer';

defineOptions({
  name: 'SelectCustomersDrawer',
});
const emit = defineEmits(['close-tkr', 'select-customer-row:row']);
const { t } = useI18n();
// 商品表格配置
const customerColumns = computed(() => {
  return [
    {
      type: 'radio',
      minWidth: 50,
      fixed: 'left',
      slots: { default: 'radio' },
    },
    {
      field: 'name',
      title: t('scan.customer'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'phone_number',
      title: t('scan.tel'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'balance',
      title: t('scan.balance'),
      minWidth: 170,
      align: 'center',
    },

    {
      field: 'points',
      title: t('scan.points'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'vip_code',
      title: t('scan.vip-code'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'cost_price',
      title: t('common.action'),
      minWidth: 170,
      align: 'center',
      slots: { default: 'action' },
    },
  ];
});
const keywords = ref('');
const customerGridOptions = {
  columns: customerColumns.value,
  mergeCells: [],
  class: 'w-full p-0',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getCustomerPageListApi({
          keywords: keywords.value,
        });
      },
    },
  },
};
// 客户表格
const [customerGrid, customerGridApi] = useIgourdVxeGrid({
  gridOptions: customerGridOptions,
});
const customerStore = useCustomerStore();
const { customerList, total } = storeToRefs(customerStore);

const fetchGoodsList = debounce(async () => {
  await customerStore.getCustomerList({
    page_size: 100,
    keywords: keywords.value,
  });
}, 500);
const handleRowClick = (row) => {
  emit('select-customer-row:row', row);
  drawerApi.close();
  emit('close-tkr');
};
const handleSearch = () => {
  customerGridApi.reload();
};
const handleConfirm = () => {
  const selectedRows = customerGridApi.grid.getRadioRecord();
  if (Object.keys(selectedRows).length === 0) {
    ElMessage.warning(t('scan.please-select-customer'));
    return;
  }
  handleRowClick(selectedRows);
};
const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {
      customerGridApi.reload();
    }
  },
});
</script>

<template>
  <Drawer>
    <section class="h-full w-full p-5">
      <div class="flex h-full w-full flex-col gap-2.5">
        <div class="flex w-full flex-shrink-0 gap-1">
          <ElInput
            v-model="keywords"
            style="height: 36px"
            :placeholder="$t('scan.search-placeholder')"
            clearable
            @clear="handleSearch"
            class="flex-1"
          />
          <ElButton
            class="outer-btn right-box search-btn blue-btn mr-0 h-9 shrink-0"
            type="primary"
            @click="handleSearch"
          >
            <div class="outer">
              <div class="inner-left">
                <i class="iconfont icon-sousuo"></i>
              </div>
              <div class="inner-right">
                <span> {{ $t('common.search') }}</span>
              </div>
            </div>
          </ElButton>
        </div>
        <section class="bg-card flex-grow">
          <customerGrid>
            <template #action="{ row }">
              <section class="flex items-center justify-center">
                <div>
                  <ElButton type="primary" link @click="handleRowClick(row)">
                    {{ t('common.details') }}
                  </ElButton>
                </div>
                <div>
                  <ElButton type="danger" link @click="handleRowClick(row)">
                    {{ t('common.cancel') }}
                  </ElButton>
                </div>
              </section>
            </template>
          </customerGrid>
        </section>
      </div>
    </section>
    <template #footer>
      <section class="flex w-full justify-between">
        <div>
          <ElButton class="h-[44px]" type="primary" plain>
            {{ t('common.add') }}
          </ElButton>
        </div>
        <div>
          <ElButton class="h-[44px]" type="danger" plain>
            {{ t('common.cancel') }}
          </ElButton>
          <ElButton class="h-[44px]" type="primary" @click="handleConfirm">
            {{ t('common.confirm') }}
          </ElButton>
        </div>
      </section>
    </template>
  </Drawer>
</template>
