<script setup lang="ts">
import type { TreeNode } from 'element-plus';

import { onMounted, ref } from 'vue';

import {
  ColPage,
  confirm,
  ElButton,
  ElTree,
  useIgourdDrawer,
  ElIcon,
} from '@igourd/common-ui';
import { CirclePlus, Edit, Delete } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import {
  getFirstGroupList,
  getSecondGroupList,
  removeGroup,
} from '@@/inventory/apis';
import { useProductGroupList } from '@@/inventory/hooks';

import folderClose from '../../../../assets/inventory/folder-close.svg';
import folderOpen from '../../../../assets/inventory/folder-open.svg';
import drawer from '../../components/product-group/drawer.vue';
import type { SecondGroupItem } from '@@/inventory/types';
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
const treeRef = ref();

const { Grid, gridApi, handleQueryTable, handleEdit } = useProductGroupList();
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});

// 获取一级分类
const getFirstLevelCategory = async (resolve?: (data: any) => void) => {
  const result = await getFirstGroupList({
    page_num: productGroupData.value.page_num,
    page_size: 10,
  });
  const list = result.list;
  let treeList = [];
  // 将list处理成element-plus的tree数据格式
  treeList = list.map((item: SecondGroupItem) => ({
    ...item,
    id: item.id,
    label: item.major_name,
    children: [],
    leaf: !item.has_children,
  }));

  productGroupData.value.list = treeList;
  resolve && resolve(treeList);
};
const loadNode = async (node: TreeNode, resolve) => {
  const { level } = node;
  if (level == 0) {
    getFirstLevelCategory(resolve);
    return;
  }
  const result = await getSecondGroupList({
    parent_id: node.data.id,
    page_num: productGroupData.value.page_num,
    page_size: 10,
  });
  const list = result.list;
  const treeList = list.map((item: SecondGroupItem) => ({
    ...item,
    id: item.id,
    label: item.major_name,
    leaf: !item.has_children,
  }));

  resolve(treeList);
};
const handleAddGroup = () => {
  drawerApi.setData(null).open();
};
// 新增子分类
const handleAddSubGroup = (node: SecondGroupItem) => {
  node.data.sub = 'sub';
  drawerApi.setData(node.data).open();
};
const handleEditGroup = (node: SecondGroupItem) => {
  drawerApi.setData(node.data).open();
};
const handleRemove = async (node: SecondGroupItem) => {
  confirm({
    title: t('common.prompt'),
    content: t('common.confirmPrompt', {
      value: t('product-group.category'),
    }),
  }).then(
    async () => {
      const params = {
        product_group_ids: [node.data.id],
      };
      removeGroup(params).then(() => {
        getFirstLevelCategory();
      });
    },
    () => {
      console.log('cancle');
    },
  );
};
const handleNodeClick = (node: SecondGroupItem) =>{
   handleQueryTable({product_group_id:node?.id})
}
const refreshTree = () => {
  getFirstLevelCategory();
};

onMounted(async () => {
  getFirstLevelCategory();
});
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card h-full rounded p-2.5">
        <p class="flex justify-between text-sm font-medium">
          {{ t('product-group.product-category') }}
          <ElButton type="primary" @click="handleAddGroup">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div class="mt-5">
          <ElTree
            ref="treeRef"
            node-key="id"
            :data="productGroupData.list"
            :load="loadNode"
            lazy
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="inline-flex w-full items-center">
                <div class="inline-flex flex-1">
                  <img :src="data.expanded ? folderOpen : folderClose" alt="" />
                  <span class="pl-1">{{ node.label }}</span>
                </div>
                <div class="show-opertion">
                  <ElIcon
                    class="text-primary ml-1"
                    @click.stop="handleAddSubGroup(node)"
                    ><CirclePlus
                  /></ElIcon>
                  <ElIcon
                    class="text-primary ml-1"
                    @click.stop="handleEditGroup(node)"
                    ><Edit
                  /></ElIcon>
                  <ElIcon
                    class="ml-1"
                    style="color: var(--el-color-danger)"
                    @click.stop="handleRemove(node)"
                    ><Delete
                  /></ElIcon>
                </div>
              </div>
            </template>
          </ElTree>
        </div>
      </section>
    </template>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer @refresh-tree="refreshTree" />
  </ColPage>
</template>
<style scoped>
.show-opertion {
  display: none;
}

.el-tree-node:hover .show-opertion {
  display: flex;
}
</style>
