<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { IgourdButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'IPurchaseList',
});

function getVendorPageListApi(data: any) {
  return requestClient.post('v1/merchant/purchase/vendor/page-list', data);
}

// const [Drawer, drawerApi] = useIgourdDrawer();
const { t } = useI18n();
interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}
const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    console.log(row);
  },
  filterChange({ $grid, filterList }) {
    const query: Record<string, any> = {};
    filterList.forEach((item) => {
      query[item.field] = item.values;
    });
    $grid.commitProxy('reload', query);
  },
};
const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  filterConfig: {
    remote: true,
  },
  columns: [
    { title: t('common.search'), type: 'seq', width: 80 },
    { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'category', title: 'Category' },
    {
      field: 'color',
      title: 'Color',
      filters: [
        { label: '28', value: 28 },
        { label: '22', value: 22 },
        { label: '38', value: 38 },
      ],
    },
    { field: 'productName', title: 'Product Name' },
    { field: 'price', title: 'Price' },
    { field: 'releaseDate', formatter: 'formatDateTime', title: 'DateTime' },
  ],
  exportConfig: {},
  height: 'auto', // 如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素，否则会出现高度闪动问题
  keepSource: true,
  proxyConfig: {
    form: false,
    ajax: {
      query: async ({ page }, form = {}) => {
        return await getVendorPageListApi({
          page_num: page.currentPage,
          page_size: page.pageSize,
          merchant_id: '1938848394566025217',
          ...form,
        });
      },
    },
  },

  toolbarConfig: {
    custom: true,
    export: false,
    import: false,
    refresh: true,
    zoom: true,
  },
};
const schema = {
  username: {
    type: 'string',
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      gridSpan: 'span 2',
    },
    'x-component': 'Input',
    'x-class': 'w-full',
    'x-component-props': {
      placeholder: '输入(供应商名称,联系人,联系人号码)',
    },
  },
};

const [Grid, gridApi] = useIgourdVxeGrid({
  gridEvents,
  gridOptions,
  formOptions: { schema, scope: {} },
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton>新增</IgourdButton>
      </template>
    </Grid>
  </Page>
</template>
