<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElMessage,
  ElTag,
  Page,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  productLabelBind,
  productLabelPage,
  productProfileDetail,
} from '@@/inventory/apis';
import { useInventoryProductList } from '@@/inventory/hooks';
import { useAddProduct } from '@@/inventory/hooks/product-list/addProduct';

defineOptions({
  name: 'IInventoryProductList',
});
const { t } = useI18n();
const mode = ref('add');

const { Grid, gridApi, handleBatchDelete, canBatchOperate } =
  useInventoryProductList();
const { Drawer, drawerApi } = useAddProduct();
const drawerRef = ref<Drawer>(null);
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
const allLabels = ref([]);

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
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleAddProduct('add')">
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
        <ElButton type="text" @click="handleAddProduct('details', row)">
          {{ t('common.detail') }}
        </ElButton>
        <ElButton type="text" @click="handleAddProduct('copy', row)">
          {{ t('common.copy') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete()">
          {{ t('common.delete') }}
        </ElButton>
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
              isSelected(label) ? 'rounded-sm bg-[#ecf5ff] text-[#409eff]' : ''
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
    <Drawer ref="drawerRef" :mode="mode" @saved="gridApi.reload()" />
  </Page>
</template>
