<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ElButton, ElTabPane, ElTabs, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useChartOfAccounts } from '@@/account/hooks';

import { getLanguageDict } from '#/utils/language';

defineOptions({
  name: 'IChartOfAccounts',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, handleQueryTable } =
  useChartOfAccounts();

// 页签数据
const tabsData = ref([]);
// 当前页签
const activeName = ref('');
// 当前分类
const currentCategoryEnum = ref();
const isLoadGrid = ref(false);
// 获取分类数据及设置默认tab
const accountLedgerCategoryEnum = async () => {
  const enumData = await getLanguageDict(
    'basics.accounting.account-ledger-category-enum',
  );
  tabsData.value = enumData;
  activeName.value = enumData[0].value;
  currentCategoryEnum.value = enumData[0];
  isLoadGrid.value = true;
  handleQueryTable({
    category: currentCategoryEnum.value.value,
  });
};
const handleTabClick = (tab) => {
  currentCategoryEnum.value = tabsData.value[tab.index];
  handleQueryTable({
    category: currentCategoryEnum.value.value,
  });
};
onMounted(async () => {
  accountLedgerCategoryEnum();
});
</script>

<template>
  <Page auto-content-height>
    <ElTabs v-model="activeName" class="ml-4" @tab-click="handleTabClick">
      <ElTabPane
        v-for="item in tabsData"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </ElTabs>
    <Grid v-if="isLoadGrid">
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('account.add_sub_ledger') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleBatchDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
