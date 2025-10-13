<script setup lang="ts">
import type { ProductLabelItem } from '@@/inventory/types';

import { onMounted, ref } from 'vue';

import {
  ColPage,
  confirm,
  ElButton,
  ElRadio,
  ElRadioGroup,
  useIgourdDrawer,
  ElIcon,
} from '@igourd/common-ui';
import { Edit, Delete,Document } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { getProductLabelList, removeProductLabel } from '@@/inventory/apis';
import { useInventoryProductLabelList, useProductLabelDetail} from '@@/inventory/hooks';

import drawer from '../../components/product-label/drawer.vue';
import StatusTemplate from '#/components/status/index.vue';

defineOptions({
  name: 'IInventoryProductLabel',
});
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
const{Drawer:Detail,drawerApi:detailDrawerApi} = useProductLabelDetail()
const { t } = useI18n();
const {
  Grid,
  handleEdit,
  canBatchOperate,
  handleBatchDelete,
  handleQueryTable,
} = useInventoryProductLabelList();
const productLabelList = ref<ProductLabelItem[]>([]);
const selectedLabelId = ref<string>('');
// 获取商品标签列表
const handleGetProductLabelList = async () => {
  const res = await getProductLabelList({});
  if (res) {
    productLabelList.value = res.list || [];
  }
};
// 商品详情相关
const productShow = ref(false);
const goodParms = ref({
  title: t('inventory.productDetails'),
  visible: true,
  innerDrawerShow: true,
});

// 处理商品详情显示
const handleProductDetail = async (row: any) => {
  goodParms.value.title = t('inventory.productDetails');
  productShow.value = true;
  // 这里应该调用 API 获取商品详情
};

// 处理关闭
const handleClose = () => {
  productShow.value = false;
};
const handleAddLabel = () => {
  drawerApi.setData(null).open();
};
const handleEditLabel = (item) => {
  drawerApi.setData(item).open();
};
const handleViewLabel = (item) =>{
  detailDrawerApi.setData(item).open();
}
const handleRemove = async (item) => {
  confirm({
    title: t('common.prompt'),
    content: t('common.confirmPrompt', {
      value: t('product-label.add-product-label'),
    }),
  }).then(
    async () => {
      removeProductLabel({
        product_label_ids: [item.id],
      }).then(() => {
        handleGetProductLabelList();
      });
    },
    () => {},
  );
};
const refreshTree = () => {
  handleGetProductLabelList();
};
const handleChangeLabel = (value: String) => {
  handleQueryTable(value);
};
const STATUS_CONFIG = [
  {
    name: 'inventory.offSale',
    value: 'OFF_SALE',
    iconColor: '#9e9e9e',
  },
  {
    name: 'inventory.onSale',
    value: 'ON_SALE',
    iconColor: '#4caf51',
  },

];

onMounted(() => {
  handleGetProductLabelList();
});
</script>

<template>
  <ColPage auto-content-height>
    <template #left>
      <section class="bg-card mr-2 h-full rounded p-2.5">
        <p class="flex justify-between text-sm font-medium">
          {{ t('product-label.product-label') }}
          <ElButton type="primary" @click="handleAddLabel">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div>
          <ElRadioGroup
            v-model="selectedLabelId"
            @change="handleChangeLabel"
            class="label-box w-full"
          >
            <div class="w-full">
              <ElRadio
                label="1"
                v-for="item in productLabelList"
                :key="item.id"
                style="display: flex"
                :value="item.id"
              >
                <div class="inline-flex w-full items-center">
                  <div class="flex-1">{{ item.name }}</div>
                  <div class="show-opertion text-right">
                  <ElIcon
                    class="text-primary ml-1"
                    @click="handleEditLabel(item)"
                    ><Edit
                  /></ElIcon>
                  <ElIcon
                    class="text-primary ml-1"
                    @click="handleViewLabel(item)"
                    ><Document
                  /></ElIcon>

                  <ElIcon
                    class="ml-1"
                    style="color: var(--el-color-danger)"
                    @click="handleRemove(item)"
                    ><Delete/></ElIcon>

                  </div>
                </div>
              </ElRadio>
            </div>
          </ElRadioGroup>
        </div>
      </section>
    </template>
    <Grid>
      <template #table-actions>
        <!--
        <ElButton
          v-auth="'inventory_product_label_add'"
          type="primary"
          @click="handleEdit()"
        >
          <i class="iconfont icon-tianjia-dianpu mr-1"></i>
          {{ t('employee.addButton') }}
        </ElButton>
        -->
        <ElButton
          v-if="canBatchOperate"
          v-auth="'inventory_product_label_delete'"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #status="{ row }">
        <StatusTemplate
          :value="row.status"
          :status-list="STATUS_CONFIG"
        />
      </template>
      <template #productDetail="{ row }">
        <el-tooltip
          effect="customized"
          :content="t('common.detail')"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <i
            v-auth="'inventory_product_label_detail'"
            class="iconfont icon-peiqudan icon-buy cursor-pointer"
            @click="handleProductDetail(row)"
          ></i>
        </el-tooltip>
      </template>
      <template #operation="{ row }">
        <ElButton
          v-auth="'inventory_product_label_edit'"
          type="text"
          @click="handleEdit(row)"
        >
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer @refresh-tree="refreshTree" />
    <Detail></Detail>
    <!--TODO Move TO Formily-->
    <!-- 商品详情弹窗 -->
    <el-dialog
      v-model="productShow"
      :title="goodParms.title"
      width="80%"
      @close="handleClose"
    >
      <div class="text-center text-gray-500">
        {{ t('inventory.productDetails') }}
      </div>
    </el-dialog>
  </ColPage>
</template>

<style scoped>
.icon-buy {
  cursor: pointer;
}

:deep(.label-box .el-radio__label) {
  display: block;
  width: 100%;
}

:deep(.label-box .el-radio) {
  margin-right: 0;
}

.show-opertion {
  display: none;
}

.el-radio.is-checked .show-opertion {
  display: flex;
}
</style>
