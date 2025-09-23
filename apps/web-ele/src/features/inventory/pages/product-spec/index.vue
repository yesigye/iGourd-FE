<script setup lang="ts">
import type { ProductLabelItem } from '../../types';

import { onMounted, ref } from 'vue';

import {
  ColPage,
  confirm,
  ElButton,
  ElRadio,
  ElRadioGroup,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useInventoryProductSpec } from '@@/inventory/hooks';

import { deleteProductSpec, getProductSpecList } from '../../apis/product-spec';
import drawer from '../../components/product-spec/drawer.vue';
import drawerValue from '../../components/product-spec/drawerValue.vue';

defineOptions({
  name: 'IInventoryProductSpec',
});
const { t } = useI18n();
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});

const [DrawerValue, drawerValueApi] = useIgourdDrawer({
  connectedComponent: drawerValue,
  appendToMain: true,
});
const { Grid, handleQueryTable } = useInventoryProductSpec();
const productSpecList = ref<ProductLabelItem[]>([]);
const selectedLabelId = ref<string>('');
// 获取商品规格列表
const handleGetProductSpecList = async () => {
  const res = await getProductSpecList({});
  if (res) {
    productSpecList.value = res || [];
  }
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
      deleteProductSpec({
        id: item.id,
      }).then(() => {
        handleGetProductSpecList();
      });
    },
    () => {
      console.log('cancle');
    },
  );
};
const refreshTree = () => {
  handleGetProductSpecList();
};
// 增加规格值
const handleAddSpecValue = () => {
  drawerValueApi
    .setData({
      product_spec_id: selectedLabelId.value,
    })
    .open();
};
const handleChangeSpec = (value: String) => {
  handleQueryTable(value);
};
onMounted(() => {
  handleGetProductSpecList();
});
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card mb-5 h-full rounded p-2.5">
        <p class="flex justify-between text-sm font-medium">
          {{ t('product-spec.product-spec') }}
          <ElButton type="primary" @click="handleAddLabel">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div>
          <ElRadioGroup
            v-model="selectedLabelId"
            @change="handleChangeSpec"
            class="label-box w-full"
          >
            <div class="w-full">
              <ElRadio
                label="1"
                v-for="item in productSpecList"
                :key="item.id"
                style="display: flex"
                :value="item.id"
              >
                <div class="inline-flex w-full items-center">
                  <div class="flex-1">{{ item.product_spec_name }}</div>
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
        <ElButton type="primary" @click="handleAddSpecValue">
          {{ t('common.add') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer @refresh-tree="refreshTree" />
    <DrawerValue />
  </ColPage>
</template>

<style scoped>
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
