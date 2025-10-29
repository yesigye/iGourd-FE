<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, nextTick, ref } from 'vue';

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
    field: `spec_${spec.productSpecName}`,
    title: spec.productSpecName,
    minWidth: 170,
    align: 'center',
    value: spec.productSpecValue,
    productSpecValueId: spec.productSpecValueId,
  }));
  return JSON.parse(JSON.stringify(specList));
};
const dynamicColumns = ref([]);
/**
 * 生成表格合并规则
 * @param {Array} data - 商品数据列表
 * @param {Array} columns - 表格列配置，格式：[{field: 'name', label: '商品名称'}, {field: 'spec1', title: '规格1'}, ...]
 * @returns {Array} 合并规则数组，格式：[{row: 行索引, col: 列索引, rowspan: 合并行数, colspan: 合并列数}]
 */
function generateMergeCells(data, columns) {
  const mergeCells = [];

  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return mergeCells;
  }

  // 遍历每一列
  columns.forEach((column, colIndex) => {
    let currentValue = null;
    let startRow = 0;
    let rowspan = 1;

    // 遍历每一行数据
    data.forEach((item, rowIndex) => {
      // 获取当前单元格的值
      let cellValue;

      if (column.field.startsWith('spec_')) {
        // 规格列，获取 value 属性
        cellValue = item[column.field] ? item[column.field].value : null;
      }

      if (rowIndex === 0) {
        // 第一行，初始化
        currentValue = cellValue;
        startRow = rowIndex;
        rowspan = 1;
      } else if (cellValue === currentValue) {
        // 值相同，增加合并行数
        rowspan++;
      } else {
        // 值不同，保存之前的合并规则（如果需要合并）
        if (rowspan > 1) {
          mergeCells.push({
            row: startRow,
            col: colIndex,
            rowspan,
            colspan: 1,
          });
        }

        // 重新开始计算
        currentValue = cellValue;
        startRow = rowIndex;
        rowspan = 1;
      }

      // 处理最后一行
      if (rowIndex === data.length - 1 && rowspan > 1) {
        mergeCells.push({
          row: startRow,
          col: colIndex,
          rowspan,
          colspan: 1,
        });
      }
    });
  });

  return mergeCells;
}
/**
 * 专门用于获取规格合并规则的方法
 * @param {Array} productData - 商品数据，默认使用 productList
 * @param {Array} specColumns - 规格列配置，如果不传则自动提取规格列
 * @returns {Array} 规格合并规则数组
 */
function getSpecMergeCells(productData = productList, specColumns = null) {
  let targetColumns;
  const columnIndexMap = {};

  if (specColumns) {
    targetColumns = specColumns;
    // 为自定义列创建索引映射
    specColumns.forEach((specCol, specIndex) => {
      const originalIndex = productColumns.value.findIndex(
        (col) => col.field === specCol.field,
      );
      if (originalIndex !== -1) {
        columnIndexMap[specIndex] = originalIndex;
      }
    });
  } else {
    // 自动提取规格列，过滤掉 spec_code
    targetColumns = [];
    productColumns.value.forEach((col, index) => {
      if (col.field.startsWith('spec_') && col.field !== 'spec_code') {
        targetColumns.push(col);
        columnIndexMap[targetColumns.length - 1] = index; // 映射过滤后的索引到原始索引
      }
    });
  }

  const mergeCells = generateMergeCells(productData, targetColumns);

  // 修正列索引为原始表格中的索引
  return mergeCells.map((rule) => ({
    ...rule,
    col:
      columnIndexMap[rule.col] === undefined
        ? rule.col
        : columnIndexMap[rule.col],
  }));
}

// 商品表格配置
const productColumns = computed(() => {
  return [
    {
      field: 'status',
      title: t('product-list.status'),
      minWidth: 170,
      align: 'center',
      slots: {
        default: 'status',
      },
    },
    ...dynamicColumns.value,
    // 动态规格表格列
    {
      field: 'sku_barcode',
      title: t('product-list.sku-barcode'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'spec_code',
      title: t('product-list.spec-code'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'stock',
      title: t('product-list.initial-stock'),
      minWidth: 170,
      align: 'center',
    },

    {
      field: 'unit',
      title: t('common.unit'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'selling_price',
      title: t('product-list.selling-price'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'cost_price',
      title: t('product-list.cost-price'),
      minWidth: 170,
      align: 'center',
    },
    {
      field: 'Remarks',
      title: t('common.remarks'),
      minWidth: 170,
      align: 'center',
    },
  ];
});
type ProductDetail = {
  [key: string]: any; // 允许动态规格字段
  cost_price: number;
  remarks: string;
  selling_price: number;
  sku_barcode: string;
  spec_1: string;
  spec_2: string;
  spec_code: string;
  status: string;
  stock: number;
  unit: string;
};

const productGridOptions: VxeGridProps<ProductDetail> = {
  columns: productColumns.value,
  mergeCells: [],
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
const productList = ref<ProductDetail[]>([]);
const productDetail = ref({});
const productUnitlist = ref<
  {
    is_basic: boolean;
    label: string;
    span: number;
    unit: string;
    unit_id: string;
    value: number;
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
const mergeCells = ref([]);
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
        value: Number(item.is_basic)
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
    // 收集所有规格列，避免重复
    const allSpecColumns = new Map();

    productList.value.forEach((item: { product_spec_kv: string }) => {
      if (item.product_spec_kv) {
        item.product_spec_kv = JSON.parse(item.product_spec_kv || '{}');
        const currentSpecRow = generateSpecColumns(item.product_spec_kv);

        // 为当前行设置规格值
        currentSpecRow.forEach((spec) => {
          item[spec.field] = { value: spec.value, id: spec.productSpecValueId };
          // 收集所有规格列定义
          if (!allSpecColumns.has(spec.field)) {
            allSpecColumns.set(spec.field, {
              field: spec.field,
              title: spec.title,
              minWidth: spec.minWidth,
              align: spec.align,
              slots: {
                default: 'spec',
              },
            });
          }
        });
      }
    });

    // 更新动态列
    dynamicColumns.value = [...allSpecColumns.values()];
  }
  mergeCells.value = getSpecMergeCells(productList.value, dynamicColumns.value);
  ProductDetailsGridApi.reload();

  // 强制重新渲染表格以更新列配置
  nextTick(() => {
    ProductDetailsGridApi.setGridOptions({
      columns: productColumns.value,
      mergeCells: mergeCells.value,
    });
  });
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
            {{ t(`enmu.${productDetail?.status}`) || '--' }}
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
        <ProductDetailsGrid class="px-0">
          <template #spec="{ row, column, params }">
            <span>{{
              row[params?.columnName || column.field]?.value ?? '--'
            }}</span>
          </template>
          <template #status="{ row, column, params }">
            <span>{{ t(`enmu.${row?.status}`) ?? '--' }}</span>
          </template>
        </ProductDetailsGrid>
      </Card>
    </section>
  </Drawer>
</template>
