<script setup lang="ts">
import type { Tree } from 'element-plus/es/components/tree-v2/src/types.mjs';

import { onMounted, ref } from 'vue';

import { ColPage, ElButton, ElTree } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getFirstGroupList } from '../../apis/product-group';
import { useInventoryProductGroupList } from '../../hooks/product-group/list';

defineOptions({
  name: 'IInventoryProductGroup',
});

const { t } = useI18n();
const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]);
const productGroupData = ref({
  list: [],
  page_num: 1,
  page_size: 10,
  total: 0,
});
// 获取一级分类
const getFirstLevelCategory = async () => {
  const result = await getFirstGroupList({ page_num: 1, page_size: 10 });
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
const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useInventoryProductGroupList();
onMounted(async () => {
  await getFirstLevelCategory();
});
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card h-full rounded p-2.5">
        <p class="text-sm font-medium">
          {{ t('product-group.product_category') }}
        </p>
        <!-- 分类树 -->
        <div class="mt-5">
          <ElTree :data="productGroupData.list" node-key="id">
            <template #default="{ node, data }">
              <span>{{ node.label }}</span>
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
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
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

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete(row)">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </ColPage>
</template>
