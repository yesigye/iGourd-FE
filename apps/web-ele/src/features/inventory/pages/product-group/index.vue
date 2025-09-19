<script setup lang="ts">
import type { Tree } from 'element-plus/es/components/tree-v2/src/types.mjs';

import { ref } from 'vue';

import { ColPage, ElButton, ElTree } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

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
const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useInventoryProductGroupList();
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card mb-5 h-full rounded p-2.5">
        <p class="text-sm font-medium">
          {{ t('product-group.product_category') }}
        </p>
        <!-- 分类树 -->
        <div>
          <ElTree :data="dataSource" node-key="id">
            <template #default="{ node, data }">
              <span>{{ node.label }}</span>
            </template>
          </ElTree>
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
