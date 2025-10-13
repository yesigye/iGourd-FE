<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ColPage, ElButton, ElTree } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSubsidiaryLedger } from '@@/account/hooks';

import { useLanguage } from '#/hooks';

import folderClose from '../../../../assets/inventory/folder-close.svg';
import folderOpen from '../../../../assets/inventory/folder-open.svg';
import { getaccountLedgerBalanceApi } from '../../apis/subsidiary-ledger';

defineOptions({
  name: 'ISubsidiaryLedger',
});

const { t } = useI18n();
const pageData = ref({
  list: [],
  page_num: 1,
  page_size: 10,
  total: 0,
});
const treeRef = ref();
const { Grid, handleEdit, handleBatchDelete, handleQueryTable } =
  useSubsidiaryLedger();
// tree数据
const treeList = ref([]);
// 页签数据
const tabsData = ref([]);
// 当前页签
const activeName = ref('');
// 当前分类
const currentCategoryEnum = ref();
// tree当前节点
const currentNode = ref();
const handleTabClick = (tab) => {
  currentCategoryEnum.value = tabsData.value[tab.index];
  getTree();
  handleQueryTable({
    account_set_id: currentCategoryEnum.value.value,
    account_ledger_ids: [],
  });
};
// 转换算法实现
const convertToElTreeFormat = (data) => {
  return data.map((item) => {
    const node = {
      id: item.account_ledger.id,
      label: item.account_ledger.name,
      children: [],
    };

    // 递归处理子节点
    if (item.sub_ledger_trees && item.sub_ledger_trees.length > 0) {
      node.children = convertToElTreeFormat(item.sub_ledger_trees);
    }

    return node;
  });
};
// 获取tree数据
const getTree = async () => {
  const result = await getaccountLedgerBalanceApi({
    page_num: pageData.value.page_num,
    page_size: 10,
    category: currentCategoryEnum.value.value,
  });
  treeList.value = convertToElTreeFormat(result);
};
// 获取分类数据及设置默认tab
const accountLedgerCategoryEnum = async () => {
  const enumData = await useLanguage(
    'basics.accounting.account-ledger-category-enum',
  );
  tabsData.value = enumData;
  activeName.value = enumData[0].value;
  currentCategoryEnum.value = enumData[0];
  getTree();
};
const handleNodeClick = (node) => {
  currentNode.value = node;
  handleQueryTable({
    account_set_id: [node.id],
    account_ledger_ids: [],
  });
};
onMounted(async () => {
  accountLedgerCategoryEnum();
});
</script>

<template>
  <ColPage auto-content-height :left-width="20">
    <template #left>
      <section class="bg-card mr-2 h-full rounded p-2">
        <ElTree
          ref="treeRef"
          node-key="id"
          :data="treeList"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <div class="inline-flex flex-1">
              <img :src="node.expanded ? folderOpen : folderClose" alt="" />
              <span class="pl-1">{{ node.label }}</span>
            </div>
          </template>
        </ElTree>
      </section>
    </template>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
  </ColPage>
</template>
