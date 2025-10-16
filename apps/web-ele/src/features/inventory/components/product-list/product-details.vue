<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { productProfileDetail } from '@@/inventory/apis';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

const { t } = useI18n();
// 动态生成规格表格列
const generateSpecColumns = (specs) => {
  const specList = specs.map((spec, index) => ({
    field: `spec${index}`,
    title: `规格${index}`,
    minWidth: 170,
    align: 'left',
    value: spec.productSpecValue,
  }));
  return JSON.parse(JSON.stringify(specList));
};
const dynamicColumns = ref([]);

// 支付历史表格配置
const productColumns = computed(() => {
  return [
    {
      field: 'status',
      title: 'Status',
      minWidth: 170,
      align: 'left',
    },
    ...dynamicColumns.value,
    // 动态规格表格列
    {
      field: 'sku_barcode',
      title: 'SKU Barcode',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'spec_code',
      title: 'Spec Code',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'stock',
      title: 'Initial stock(By major)',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'spec_code',
      title: 'Spec Code',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'unit',
      title: 'unit',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'selling_price',
      title: 'Selling Price',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'cost_price',
      title: 'Cost Price',
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'Remarks',
      title: 'remarks',
      minWidth: 170,
      align: 'left',
    },
  ];
});
const productGridOptions: VxeGridProps<ProductDetail> = {
  columns: productColumns.value,
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
const [ProductDetailsGrid, ProductDetailsGridApi] = useIgourdVxeGrid({
  gridOptions: productGridOptions,
});
const productList = ref([]);
// 动态列
/** 获取商品详情*/
const getProductDetails = async (productId: string) => {
  const res = await productProfileDetail({
    id: productId,
  });
  productList.value = res.product_info_list || [];
  if (productList.value.length > 0) {
    productList.value.forEach((item: { product_spec_kv: string }) => {
      if (item.product_spec_kv) {
        item.product_spec_kv = JSON.parse(item.product_spec_kv || '{}');
        const currentSpecRow = generateSpecColumns(item.product_spec_kv);
        currentSpecRow.forEach((spec) => {
          item[spec.field] = spec.value;
        });
        dynamicColumns.value = generateSpecColumns(item.product_spec_kv);
      }
    });
    // dynamicColumns.value.forEach((item) => {
    //   productList.value.forEach((product) => {
    //     product[item.field] = product.product_spec_kv[item.title];
    //   });
    //   productColumns.push(item);
    // });
  }
};
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(val) {
    if (val) {
      const { data } = drawerApi.getData();
      getProductDetails(data.id);
    }
  },
});
</script>

<template>
  <Drawer>
    <ProductDetailsGrid :columns="productColumns" />
  </Drawer>
</template>
