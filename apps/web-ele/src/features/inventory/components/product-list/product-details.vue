<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import {
  Card,
  ElDescriptions,
  ElDescriptionsItem,
  ElImage,
  useIgourdDrawer,
} from '@igourd/common-ui';
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

// 商品表格配置
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
  class: 'w-full p-0',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => productList.value,
    },
  },
};
const [ProductDetailsGrid, ProductDetailsGridApi] = useIgourdVxeGrid({
  gridOptions: productGridOptions,
});
const productList = ref([]);
const productDetail = ref({});
const productUnitlist = ref<
  {
    is_basic: boolean;
    label: string;
    span: number;
    unit: string;
    unit_id: string;
  }[]
>([]);
const productSpecList = ref([]);
// 重置弹窗
const handleReset = () => {
  productDetail.value = {};
  productList.value = [];
  productUnitlist.value = [];
  productSpecList.value = [];
};
// 动态列
/** 获取商品详情*/
const getProductDetails = async (productId: string) => {
  const res = await productProfileDetail({
    id: productId,
  });
  productDetail.value = res || {};
  productList.value = res.product_info_list || [];
  const majorUnit = productList.value.find((item) => item.is_basic);
  productList.value.forEach((item) => {
    // 处理单位信息
    if (productUnitlist.value.length === 0) {
      productUnitlist.value.push({
        label: item.is_basic
          ? t('product-list.major-unit')
          : t('product-list.minor-unit'),
        value: item.product_unit_name,
        unit: item.product_unit_name,
        unit_id: item.product_unit_id,
        is_basic: item.is_basic,
        span: 1,
      });
      productUnitlist.value.push({
        label: t('product-list.unit-rate'),
        value: item.is_basic
          ? 1
          : `1 ${item.product_unit_name} = ${item.basic_unit_radio} ${majorUnit.product_unit_name}`,
        unit: item.product_unit_name,
        unit_id: item.product_unit_id,
        is_basic: item.is_basic,
        span: 2,
      });
    } else {
      const unitIndex = productUnitlist.value.findIndex(
        (unit) => unit.unit_id === item.product_unit_id,
      );
      if (unitIndex === -1) {
        productUnitlist.value.push({
          label: item.is_basic
            ? t('product-list.major-unit')
            : t('product-list.minor-unit'),
          value: item.product_unit_name,
          unit: item.product_unit_name,
          unit_id: item.product_unit_id,
          is_basic: item.is_basic,
          span: 1,
        });
        productUnitlist.value.push({
          label: t('product-list.unit-rate'),
          value: item.is_basic
            ? 1
            : `1 ${item.product_unit_name} = ${item.basic_unit_radio} ${majorUnit.product_unit_name}`,
          unit: item.product_unit_name,
          unit_id: item.product_unit_id,
          is_basic: item.is_basic,
          span: 2,
        });
      }
    }
    // 处理规格信息
    if (item.product_spec_kv) {
      const productSpecKv = JSON.parse(item.product_spec_kv || '[]');
      let specVal = '';
      productSpecKv.forEach((specItem) => {
        specVal +=
          specVal === ''
            ? specItem.productSpecName
            : `--${specItem.productSpecName}`;
      });
      if (specVal !== '') {
        productSpecList.value.push(specVal);
      }
    }
  });
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
  ProductDetailsGridApi.reload();
};
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(val) {
    if (val) {
      const { data } = drawerApi.getData();
      getProductDetails(data.id);
    }
  },
  onClosed() {
    handleReset();
  },
});
</script>

<template>
  <Drawer>
    <section class="px-4 py-4">
      <Card :header="t('product-list.basic-information')" class="border-0">
        <ElDescriptions class="margin-top" :column="3" label-width="120" border>
          <ElDescriptionsItem
            :label="t('product-list.name-major')"
            min-width="186"
          >
            {{ productDetail?.major_name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            :span="2"
            :label="t('product-list.image')"
            min-width="186"
          >
            <ElImage
              :src="productDetail?.profile_photo"
              :preview-src-list="[productDetail?.image]"
            />
          </ElDescriptionsItem>

          <ElDescriptionsItem
            :label="t('product-list.product-code')"
            min-width="186"
          >
            {{ productDetail?.product_code }}
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.vat')" min-width="186">
            {{ productDetail?.tax_vat?.tax_amount || '--' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.status')" min-width="186">
            {{ productDetail?.status || '--' }}
          </ElDescriptionsItem>

          <ElDescriptionsItem
            :label="t('product-list.name-minor')"
            min-width="186"
          >
            {{ productDetail?.minor_name || '--' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            :label="t('product-list.excise-duty')"
            min-width="186"
          >
            {{ productDetail?.tax_excise?.tax_amount || '--' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            :label="t('product-list.product-label')"
            min-width="186"
          >
            {{ productDetail?.tax_excise?.tax_amount || '--' }}
          </ElDescriptionsItem>

          <ElDescriptionsItem
            :label="t('product-list.spec-model')"
            min-width="186"
          >
            {{ productDetail?.product_spec_model || '--' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            :label="t('product-list.other-vat')"
            min-width="186"
          >
            {{ productDetail?.tax_other?.tax_amount || '--' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            :label="t('product-list.category')"
            min-width="186"
          >
            {{ productDetail?.product_group_name || '--' }}
          </ElDescriptionsItem>
          <!-- <ElDescriptionsItem :label="t('product-list.shelf-life-mgmt')">
            Suzhou
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.shelf-life-unit')">
            <el-tag size="small">School</el-tag>
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.shelf-life')">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </ElDescriptionsItem> -->
          <!-- <ElDescriptionsItem :label="t('product-list.warning-days')">
            Suzhou
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.ecm')">
            <el-tag size="small">School</el-tag>
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="t('product-list.batch-mgmt')">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </ElDescriptionsItem> -->
        </ElDescriptions>
      </Card>
      <Card :header="t('product-list.unit')" class="border-0">
        <ElDescriptions class="margin-top" :column="4" label-width="120" border>
          <ElDescriptionsItem
            v-for="item in productUnitlist"
            :key="item.unit_id"
            :label="item.label"
            :span="item.span"
            min-width="186"
          >
            {{ item.value }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </Card>
      <Card
        :header="t('product-list.spec')"
        class="border-0"
        v-if="productSpecList.length > 0"
      >
        <ElDescriptions class="margin-top" :column="3" label-width="120" border>
          <template v-for="(item, index) in productSpecList" :key="item">
            <ElDescriptionsItem
              :label="t('product-list.spec') + (index + 1)"
              :span="1"
              min-width="186"
            >
              {{ item }}
            </ElDescriptionsItem>
          </template>
        </ElDescriptions>
      </Card>
      <Card :header="t('product-list.sku')" class="border-0">
        <ProductDetailsGrid :columns="productColumns" class="px-0" />
      </Card>
    </section>
  </Drawer>
</template>
