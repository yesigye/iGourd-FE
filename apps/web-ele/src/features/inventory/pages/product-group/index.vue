<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  ColPage,
  confirm,
  ElButton,
  ElTree,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import folderClose from '../../../../assets/inventory/folder-close.svg';
import folderOpen from '../../../../assets/inventory/folder-open.svg';
import {
  getFirstGroupList,
  getSecondGroupList,
  removeGroup,
} from '../../apis/product-group';
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

const { Grid, handleEdit } = useProductGroupList();
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});

// 获取一级分类
const getFirstLevelCategory = async (resolve) => {
  const result = await getFirstGroupList({
    page_num: productGroupData.value.page_num,
    page_size: 10,
  });
  const list = result.list;
  let treeList = [];
  // 将list处理成element-plus的tree数据格式
  treeList = list.map((item) => ({
    ...item,
    id: item.id,
    label: item.major_name,
    children: [],
    leaf: true,
  }));
  productGroupData.value.list = treeList;
  productGroupData.value.total = result.total;
  resolve(treeList);
};
const loadNode = async (node, resolve) => {
  const { level } = node;
  if (level == 0) {
    getFirstLevelCategory(resolve);
    return;
  }
  const result = await getSecondGroupList({
    parent_id: node.id,
    page_num: productGroupData.value.page_num,
    page_size: 10,
  });
  const list = result.list;
  const treeList = list.map((item) => ({
    ...item,
    id: item.id,
    label: item.major_name,
    leaf: true,
  }));

  resolve(treeList);
};
const handleAddGroup = (item) => {
  drawerApi.setData(null).open();
};
const handleEditGroup = (node) => {
  drawerApi.setData(node.data).open();
};
const handleRemove = async (node) => {
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
const handleNodeClick = (data) => {
  debugger;
};
const refreshTree = () => {
  getFirstLevelCategory();
};

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
          <ElButton type="primary" @click="handleAddGroup">
            {{ t('common.add') }}
          </ElButton>
        </p>
        <!-- 分类树 -->
        <div class="mt-5">
          <ElTree
            node-key="id"
            :load="loadNode"
            lazy
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="inline-flex w-full items-center">
                <div class="inline-flex flex-1">
                  <img :src="data.isLeaf ? folderOpen : folderClose" alt="" />
                  <span class="pl-1">{{ node.label }}</span>
                </div>
                <div class="show-opertion">
                  <i
                    class="iconfont icon-icon_Edit mr-4"
                    @click.stop="handleEditGroup(node)"
                  ></i>
                  <i
                    class="iconfont icon-icon_del"
                    @click.stop="handleRemove(node)"
                  ></i>
                </div>
              </div>
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
