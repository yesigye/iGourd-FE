<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  ColPage,
  ElButton,
  ElTabPane,
  ElTabs,
  ElTree,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSubsidiaryLedger } from '@@/account/hooks';

import { getLanguageDict } from '#/utils/language';

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
const { Grid, handleEdit, handleBatchDelete, canBatchOperate } =
  useSubsidiaryLedger();
const treeList = ref([]);
const tabsData = ref([]);

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
    category: 'ASSET',
  });
  treeList.value = convertToElTreeFormat(result);
};

const accountLedgerCategoryEnum = async () => {
  const enumData = await getLanguageDict(
    'basics.accounting.account-ledger-category-enum',
  );
  tabsData.value = enumData;
};
onMounted(async () => {
  getTree();
  accountLedgerCategoryEnum();
});
</script>

<template>
  <ElTabs>
    <ElTabPane
      v-for="item in tabsData"
      :key="item.value"
      :label="item.label"
      :name="item.value"
    >
      {{ item.label }}
    </ElTabPane>
  </ElTabs>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card h-full rounded p-2.5">
        <!-- 分类树 -->
        <div class="mt-5">
          <ElTree ref="treeRef" node-key="id" :data="treeList">
            <template #default="{ node, data }">
              <div class="inline-flex flex-1">
                <img :src="node.expanded ? folderOpen : folderClose" alt="" />
                <span class="pl-1">{{ node.label }}</span>
              </div>
            </template>
          </ElTree>
        </div>
      </section>
    </template>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleBatchDelete(row)">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
  </ColPage>
</template>
