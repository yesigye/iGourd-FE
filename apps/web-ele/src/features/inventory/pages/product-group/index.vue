<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ColPage, ElButton, ElTree, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import folderClose from '../../../../assets/inventory/folder-close.svg';
import folderOpen from '../../../../assets/inventory/folder-open.svg';
import { getFirstGroupList } from '../../apis/product-group';
import drawer from '../../components/product-group/drawer.vue';
import { useProductGroupList } from '../../hooks/product-group/list';

defineOptions({
  name: 'IInventoryProductGroup',
});

const { t } = useI18n();
const productGroupData = ref({
  list: [],
  page_num: 1,
  page_size: 10,
  total: 0,
});
// 获取一级分类
const getFirstLevelCategory = async () => {
  const result = await getFirstGroupList({
    page_num: productGroupData.value.page_num,
    page_size: 10,
  });
<<<<<<< HEAD
=======
  // debugger;
>>>>>>> 63de2a456faf37b4768ad48962c15cd660c6cc25
  const list = result.list;
  let treeList = [];
  // 将list处理成element-plus的tree数据格式
  treeList = list.map((item) => ({
    id: item.id,
    label: item.major_name,
    children: [],
  }));
  productGroupData.value.list = treeList;
  productGroupData.value.total = result.total;
};
const { Grid, handleEdit } = useProductGroupList();
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
onMounted(async () => {
  await getFirstLevelCategory();
});
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card h-full rounded p-2.5">
        <p class="flex justify-between text-sm font-medium">
          {{ t('product-group.product_category') }}
          <ElButton type="primary" @click="drawerApi.open()">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div class="mt-5">
          <ElTree :data="productGroupData.list" node-key="id">
            <template #default="{ node, data }">
              <img :src="node.isExpanded ? folderOpen : folderClose" alt="" />
              <span class="pl-1">{{ node.label }}</span>
            </template>
          </ElTree>
          <p
            class="text-center"
            v-if="productGroupData.total > productGroupData.list.length"
          >
            <ElButton type="primary" link>加载更多</ElButton>
          </p>
        </div>
      </section>
    </template>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </ColPage>
</template>
