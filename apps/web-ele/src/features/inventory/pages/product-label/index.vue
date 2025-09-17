<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useInventoryProductLabelList } from '../../hooks/product-label/list';
import { ref } from 'vue';

defineOptions({
  name: 'IInventoryProductLabel',
});

const { t } = useI18n();
const { Grid, handleEdit, canBatchOperate, handleBatchDelete } = useInventoryProductLabelList();

// 商品详情相关
const productShow = ref(false);
const productDialogList = ref([]);
const goodParms = ref({
  title: t('inventory.productDetails'),
  visible: true,
  innerDrawerShow: true
});

// 处理商品详情显示
const handleProductDetail = async (row: any) => {
  goodParms.value.title = t('inventory.productDetails');
  productShow.value = true;
  // 这里应该调用 API 获取商品详情
  console.log('显示商品详情', row);
};

// 处理关闭
const handleClose = () => {
  productShow.value = false;
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton
          v-auth="'inventory_product_label_add'"
          type="primary"
          @click="handleEdit()"
        >
          <i class="iconfont icon-tianjia-dianpu mr-1"></i>
          {{ t('employee.addButton') }}
        </ElButton>
        <ElButton
          v-if="canBatchOperate"
          v-auth="'inventory_product_label_delete'"
          type="danger"
          @click="handleBatchDelete"
        >
          {{ t('employee.deleteButton') }}
        </ElButton>
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
          <i class="iconfont icon-icon_Edit"></i>
        </ElButton>
      </template>
    </Grid>

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
  </Page>
</template>

<style scoped>
.icon-buy {
  cursor: pointer;
}
</style>
