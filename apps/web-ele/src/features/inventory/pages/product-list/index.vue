<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElLink,
  ElMessage,
  ElTag,
  IgourdIcon,
  Page,
  useIgourdModal,
} from '@igourd/common-ui';
import { ArrayDown, ArrayUp } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import {
  getSkuList,
  productLabelBind,
  productLabelPage,
  productProfileDetail,
} from '@@/inventory/apis';
import {
  useAddProduct,
  useInventoryProductList,
  useProductDetails,
  useProductImport,
} from '@@/inventory/hooks';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import StatusTemplate from '#/components/status/index.vue';

defineOptions({
  name: 'IInventoryProductList',
});
const { t } = useI18n();
const mode = ref('add');
// 商品表格配置
const productColumns = computed(() => {
  return [
    {
      field: 'major_name',
      title: t('inventory.product-name-major'),
      minWidth: 170,
      align: 'left',
    },
    // 动态规格表格列
    {
      field: 'spec_code',
      title: t('inventory.spec-code'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'sku_barcode',
      title: t('inventory.sku-barcode'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'product_unit_name',
      title: t('inventory.unit'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'cost_price',
      title: t('inventory.cost-price'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'selling_price',
      title: t('inventory.selling_price'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'stock_total_quantity_message',
      title: t('inventory.stock'),
      minWidth: 170,
      align: 'left',
    },
    {
      field: 'monthly_sales',
      title: t('inventory.monthly-sales'),
      minWidth: 170,
      align: 'left',
    },
  ];
});
const productGridOptions: VxeGridProps<ProductDetail> = {
  columns: productColumns.value,
  height: '100%',
  class: 'w-full p-0',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async () => {
        const res = await getSkuList({
          product_profile_id: selectedRows.value?.id,
        });
        return res || [];
      },
    },
  },
};
const [SkuListGrid, skuListGridApi] = useIgourdVxeGrid({
  gridOptions: productGridOptions,
});
const { Grid, gridApi, handleBatchDelete, canBatchOperate } =
  useInventoryProductList();
const { Drawer, drawerApi } = useAddProduct();
const { Drawer: DetailsDrawer, drawerApi: detailsDrawerApi } =
  useProductDetails();
const { Drawer: ImportDrawer, drawerApi: importDrawerApi } = useProductImport();

// 商品信息详情
const getProductDetail = async (id) => {
  const parms = {
    cost_price: '',
    id,
    product_profile_id: '',
    profile_photo: '',
    remark: '',
    selling_price: '',
    sku_barcode: '',
    spec_code: '',
    status: '',
  };
  const res = await productProfileDetail(parms);
  if (
    res?.product_profile_unit_radio_list &&
    res?.product_profile_unit_radio_list.length > 0
  ) {
    res?.product_profile_unit_radio_list.sort((a, b) => {
      return (b.is_basic_unit ? 1 : 0) - (a.is_basic_unit ? 1 : 0);
    });
    const findBasicUnit = res?.product_profile_unit_radio_list.find(
      (item) => item.is_basic_unit === 1,
    );
    if (!findBasicUnit) {
      res.product_profile_unit_radio_list[0].is_basic_unit = 1;
    }
  }

  return res;
};
const handleAddProduct = async (
  type: 'add' | 'copy' | 'details' | 'edit',
  row,
) => {
  mode.value = type;
  switch (type) {
    case 'add': {
      drawerApi.setData({ type });
      drawerApi.open();

      break;
    }
    case 'copy': {
      const res = await getProductDetail(row.id);
      drawerApi.setData({ type, data: res });
      drawerApi.open();

      break;
    }
    case 'details': {
      const res = await getProductDetail(row.id);
      drawerApi.setData({ type, data: res });
      drawerApi.open();

      break;
    }
    case 'edit': {
      const res = await getProductDetail(row.id);
      drawerApi.setData({ type, data: res });
      drawerApi.open();

      break;
    }
    // No default
  }
};

const [Modal, modalApi] = useIgourdModal({
  title: t('inventory.productList.labelSelect'),
  onOpenChange(isOpen) {
    if (isOpen) {
      const { data } = modalApi.getData();
      const list = data.product_label_list;
      selectedLabels.value = list;
      getProductAllLabel(list);
    }
  },
  async onConfirm() {
    const { data } = modalApi.getData();

    const params = {
      product_profile_id: data.id,
      label_id_list: selectedLabels.value.map((item) => item?.id),
    };
    const res = await productLabelBind(params);

    ElMessage({
      type: 'success',
      message: 'Add successfully',
    });
    modalApi.close();
    gridApi.reload();
  },
});

const searchKeyword = ref('');
const selectedLabels = ref([]);
const searchResults = ref([]);

const STATUS_CONFIG = [
  {
    name: 'inventory.off-sale',
    value: 'OFF_SALE',
    iconColor: '#9e9e9e',
  },
  {
    name: 'inventory.on-sale',
    value: 'ON_SALE',
    iconColor: '#4caf51',
  },
];
const handleAddLabel = (item) => {
  modalApi.setData({ type: 'add', data: item });
  modalApi.open();
};
// 检查标签是否被选中
const isSelected = (label) => {
  return selectedLabels.value.some((l) => l?.id === label?.id);
};
// 选择标签
const selectLabel = (label) => {
  if (isSelected(label)) {
    removeLabel(label);
  } else {
    selectedLabels.value.push(label);
  }
};
const getProductAllLabel = async () => {
  const LabelAllParam = {
    keywords: '',
    name: '',
    page_num: 0,
    page_size: 1000,
    start_date: '',
    end_date: '',
  };
  const res = await productLabelPage(LabelAllParam);

  searchResults.value = res?.list;
};
// 查看商品详情
const handleDetailsProduct = (row) => {
  detailsDrawerApi.setData({ data: row });
  detailsDrawerApi.open();
};
// 商品导入
const handleImportProduct = () => {
  importDrawerApi.open();
};
const selectedRows = ref({});
const pageClass = ref('h-[calc(100vh-60px)]');
const handleSetTableHeight = () => {
  pageClass.value =
    pageClass.value === 'h-[calc(100vh-60px)]'
      ? 'h-[calc(100vh-40vh)]'
      : 'h-[calc(100vh-60px)]';
};
const handleSelectRow = (row) => {
  selectedRows.value = row;
  if (pageClass.value === 'h-[calc(100vh-60px)]') {
    pageClass.value = 'h-[calc(100vh-40vh)]';
  } else {
    skuListGridApi.reload();
  }
};
</script>

<template>
  <section class="bg-card">
    <section>
      <Page :class="pageClass">
        <Grid>
          <template #table-actions>
            <ElButton type="primary" @click="handleImportProduct('add')">
              {{ t('common.import') }}
            </ElButton>
            <ElButton type="primary" @click="handleAddProduct('add', {})">
              {{ t('common.add') }}
            </ElButton>
            <ElButton
              type="danger"
              v-if="canBatchOperate"
              @click="handleBatchDelete"
            >
              {{ t('common.delete') }}
            </ElButton>
          </template>
          <template #status="{ row }">
            <StatusTemplate :value="row.status" :status-list="STATUS_CONFIG" />
          </template>
          <template #label="{ row }">
            <div class="flex flex-wrap items-center">
              <div class="flex flex-wrap items-center gap-2">
                <ElTag
                  type="primary"
                  v-for="item in row.product_label_list"
                  :key="item.id"
                >
                  {{ item.name }}
                </ElTag>
              </div>
              <ElButton
                v-if="row.product_label_list?.length"
                @click="handleAddLabel(row)"
                class="ml-2"
              >
                + New Tag
              </ElButton>
            </div>
          </template>
          <template #operation="{ row }">
            <ElButton type="text" @click="handleAddProduct('edit', row)">
              {{ t('common.edit') }}
            </ElButton>
            <ElButton type="text" @click="handleDetailsProduct(row)">
              {{ t('common.detail') }}
            </ElButton>
            <ElButton type="text" @click="handleAddProduct('copy', row)">
              {{ t('common.copy') }}
            </ElButton>
            <ElButton type="text" @click="handleBatchDelete()">
              {{ t('common.delete') }}
            </ElButton>
          </template>
          <template #major_name="{ row }">
            <div class="flex items-center justify-between gap-2.5">
              <ElLink
                href="#"
                :type="selectedRows.id === row.id ? 'primary' : ''"
                @click="handleSelectRow(row)"
              >
                {{ row.major_name }}
                <IgourdIcon icon="si:more-square-horiz-duotone" />
              </ElLink>
            </div>
          </template>
        </Grid>

        <Modal>
          <div class="label-common">
            <!-- 已选标签显示区域 -->
            <div class="flex flex-wrap gap-2">
              <ElTag
                v-for="label in selectedLabels"
                :key="label?.id"
                class="selected-label"
                closable
                @close="removeLabel(label)"
              >
                {{ label?.name }}
              </ElTag>
            </div>

            <!-- 搜索框 -->
            <div class="mt-2 flex gap-2.5">
              <ElInput
                v-model="searchKeyword"
                placeholder="Search"
                class="search-input"
              />
              <ElButton type="primary"> search </ElButton>
            </div>
          </div>

          <!-- 搜索结果列表 -->
          <div class="label-common">
            <div class="mb-4 mt-4 h-[188px] overflow-auto">
              <div
                v-for="label in searchResults"
                :key="label.id"
                class="mb-1 flex items-center justify-between pb-2 pl-3 pr-3 pt-2"
                :class="
                  isSelected(label)
                    ? 'rounded-sm bg-[#ecf5ff] text-[#409eff]'
                    : ''
                "
                @click="selectLabel(label)"
              >
                {{ label?.name }}
                <i class="iconfont icon-SURE" v-if="isSelected(label)"></i>
              </div>
              <div v-if="searchResults?.length === 0" class="no-value">
                No Value
              </div>
            </div>
          </div>
        </Modal>
        <Drawer :mode="mode" @saved="gridApi.reload()" />
        <DetailsDrawer />
        <ImportDrawer />
      </Page>
      <div class="flex items-center justify-center">
        <div
          class="flex h-[14px] w-[40px] cursor-pointer items-center justify-center bg-[#D9ECFF]"
          @click="handleSetTableHeight"
        >
          <ArrayUp
            v-if="pageClass === 'h-[calc(100vh-60px)]'"
            class="text-primary"
          />

          <ArrayDown v-else class="text-primary" />
        </div>
      </div>
    </section>

    <section
      class="bg-card mt-2.5 py-2"
      v-if="pageClass === 'h-[calc(100vh-40vh)]'"
    >
      <div
        class="flex h-5 items-center gap-1 rounded-full pl-3 text-base font-bold"
      >
        <div class="bg-primary h-2.5 w-1"></div>
        {{ t('inventory.sku-list') }}
      </div>
      <Page class="h-[calc(100vh-60vh-100px)]">
        <SkuListGrid />
      </Page>
    </section>
  </section>
</template>
