<script setup lang="ts">
import { computed, inject, ref, unref, watch } from 'vue';

import {
  Card,
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  useIgourdDrawer,
  vuedraggable,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { UploadFiles } from '#/adapter/component/upload';
import { useIgourdVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { useGridInstance } from '#/hooks';

const { t } = useI18n();

const { gridApi } = useGridInstance() || {};
// 支付历史表格配置
const productColumns = computed(() => {
  return [
    {
      field: 'product-code',
      title: t('common.product-code'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'name',
      title: t('product-list.product-name'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'spec_code',
      title: t('product-list.sku-barcode'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'stock',
      title: t('common.unit'),
      minWidth: 170,
      align: 'left',
    },

    {
      field: 'unit',
      title: t('product-list.unit-rate'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'spec_code',
      title: t('product-list.spec'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'cost_price',
      title: t('product-list.const-price'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'selling_price',
      title: t('product-list.selling-price'),
      minWidth: 170,
      align: 'left',
    },
  ] as VxeGridPropTypes.Column[any][];
});
const selected = ref<string[]>([]);
const productGridOptions: VxeGridProps<any> = {
  gridOptions: {
    columns: unref(productColumns),
  },
  height: '',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },

  proxyConfig: {
    ajax: {
      query: async () => {},
    },
  },
};
const [ProductPreviewGrid] = useIgourdVxeGrid(productGridOptions);
const [Drawer] = useIgourdDrawer({
  async onOpenChange(val) {
    if (val) {
    }
  },
});
watch(productColumns, (value) => {
  gridApi?.grid.reloadColumn(value);
});
const columns = computed(() => {
  return gridApi?.grid
    .getFullColumns()
    .filter((i) => {
      return i.type !== 'checkbox';
    })
    .filter((i) => {
      return i.field !== 'operation';
    });
});
</script>
<template>
  <Drawer>
    <Card :header="t('product-list.import-fields')" class="mb-2.5 border-0">
      <section class="flex flex-wrap gap-2">
        <div v-for="item in columns" :key="item.field">
          <ElButton @click="">{{ item.title }}</ElButton>
        </div>
      </section>
      <p class="text-gray mt-2.5 text-sm">
        Please select the Fields items you need to import
      </p>
    </Card>
    <Card :header="t('product-list.excel-list')" class="mb-2.5 border-0">
      <section class="flex flex-wrap gap-2">
        <vuedraggable :list="[1, 2, 3]">
          <template #item="{ element }">
            <ElButton type="primary">测试字段</ElButton>
          </template>
        </vuedraggable>
      </section>
    </Card>
    <Card :header="t('product-list.download-template')" class="mb-2.5 border-0">
      <div class="pb-3 pl-2.5 pr-2.5 pt-3">
        {{ t('product-list.excel-template') }}
      </div>
    </Card>
    <Card :header="t('product-list.attachment')" class="mb-2.5 border-0">
      <section>
        <UploadFiles />
      </section>
      <section>
        <p class="font-bold">{{ t('product-list.preview') }}</p>
        <div class="mt-2.5">
          <ElCheckboxGroup v-model="checkList">
            <ElCheckbox
              :label="t('product-list.generate-opening-stock')"
              value="Value A"
            />
            <ElCheckbox
              :label="t('product-list.update-modified-product-information')"
              value="Value B"
            />
          </ElCheckboxGroup>
        </div>

        <div class="mt-2.5">
          <ElButton>{{ t('product-list.all') }}</ElButton>
          <ElButton>
            {{ t('product-list.new-product') }}
          </ElButton>
          <ElButton>
            {{ t('product-list.old-product') }}
          </ElButton>
        </div>
        <div class="mt-2.5">
          <ProductPreviewGrid :columns="productColumns" class="pl-0 pr-0" />
        </div>
      </section>
    </Card>
  </Drawer>
</template>
