<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, ElTag, Page, useIgourdModal } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { productProfileDetail } from '@@/inventory/apis';
import { useInventoryProductList } from '@@/inventory/hooks';
import { useAddProduct } from '@@/inventory/hooks/product-list/addProduct';

defineOptions({
  name: 'IInventoryProductList',
});
const [Modal, { close: closeModal }] = useIgourdModal();
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
        <div v-for="item in row.product_label_list" :key="item.id">
          <ElTag type="primary">
            {{ item.name }}
          </ElTag>
          <ElButton @click="showInput" class="ml-2"> + New Tag </ElButton>
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

    <Drawer ref="drawerRef" :mode="mode" @saved="gridApi.reload()" />
  </Page>
</template>
