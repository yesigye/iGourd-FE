<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

import {
  ColPage,
  confirm,
  ElButton,
  ElRadio,
  ElRadioGroup,
  useIgourdDrawer,
  ElInfiniteScroll,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  getCustomerLabelPageListApi,
  deleteCustomerLabelApi,
} from '@@/customer/apis';
import drawer from '@@/customer/components/label/drawer.vue';
import { useCustomerLabel } from '@@/customer/hooks/label';
defineOptions({
  name: 'ICustomerLabel',
});
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
const { t } = useI18n();
const { Grid, handleEdit, canBatchOperate, handleBatchDelete } =
  useCustomerLabel();
const selectedLabelId = ref<string>('');

const customerLabelInfo = ref({
  list: [],
  page_num: 1,
  page_size: 30,
  total: 0,
  isFirstLoad: false,
  isLoading: true,
});
// 获取商品标签列表
const handleGetProductLabelList = async () => {
  customerLabelInfo.value.isLoading = true;
  const res = await getCustomerLabelPageListApi({
    page_num: customerLabelInfo.value.page_num,
    page_size: customerLabelInfo.value.page_size,
  });
  if (res) {
    customerLabelInfo.value.list = [
      ...customerLabelInfo.value.list,
      ...res.list,
    ];
    customerLabelInfo.value.total = res.total;
    customerLabelInfo.value.isLoading = false;
    nextTick(() => {
      customerLabelInfo.value.isFirstLoad = true;
    });
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
const handleAddLabel = (item) => {
  drawerApi.setData(null).open();
};
const handleEditLabel = (item) => {
  drawerApi.setData(item).open();
};
const handleRemove = async (item) => {
  confirm({
    title: t('common.prompt'),
    content: t('common.confirmPrompt', {
      value: t('product-label.add-product-label'),
    }),
  }).then(
    async () => {
      deleteCustomerLabelApi({
        label_id_list: [item.id],
      }).then(() => {
        handleGetProductLabelList();
      });
    },
    () => {
      console.log('cancle');
    },
  );
};
// 首次加载是否完成
// 加载更多
const handleLoadMore = async () => {
  // 因为动态高度避免首次获取列表的时候触发加载
  if (customerLabelInfo.value.isFirstLoad) {
    console.log('加载更多');
    if (customerLabelInfo.value.isLoading) {
      return;
    }
    customerLabelInfo.value.page_num++;
    await handleGetProductLabelList();
  }
};
const refreshTree = () => {
  handleGetProductLabelList();
};

onMounted(async () => {
    await handleGetProductLabelList();

});
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card mb-5 h-full rounded p-2.5">
        <p class="flex justify-between text-sm font-medium">
          {{ t('label.curtomer-label') }}
          <ElButton type="primary" @click="handleAddLabel">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div
          class="classification-tree mt-5 overflow-auto"
          v-infinite-scroll="handleLoadMore"
          :infinite-scroll-immediate="false"
        >
          <ElRadioGroup v-model="selectedLabelId" class="label-box w-full">
            <div class="w-full">
              <ElRadio
                label="1"
                v-for="item in customerLabelInfo.list"
                :key="item.id"
                style="display: flex"
                :value="item.id"
              >
                <div class="inline-flex w-full items-center">
                  <div class="flex-1">{{ item.name }}</div>
                  <div class="show-opertion text-right">
                    <i
                      class="iconfont icon-icon_Edit mr-4"
                      @click="handleEditLabel(item)"
                    ></i>
                    <i
                      class="iconfont icon-icon_del"
                      @click="handleRemove(item)"
                    ></i>
                  </div>
                </div>
              </ElRadio>
            </div>
          </ElRadioGroup>
        </div>
      </section>
    </template>
    <Grid>
      <template #table-title>
        <ElButton
          v-if="canBatchOperate"
          v-auth="'inventory_product_label_delete'"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton
          type="text"
          @click="handleEdit(row)"
        >
        {{ t('common.edit') }}
        </ElButton>
         <ElButton
          type="text"
          @click="handleEdit(row)"
        >
         {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer @refresh-tree="refreshTree" />

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

.classification-tree {
  height: calc(100% - 52px);
}
</style>
