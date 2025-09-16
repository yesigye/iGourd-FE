<template>
  <Page auto-content-height>
    <div class="subsidiary-ledger-container">
      <!-- 顶部搜索区域 -->
      <div class="top-search">
        <PeriodRangePicker
          :value="periodsRange"
          :periods="periods"
          :visible="periodsRangeVisible"
          @cancel="handlePeriodsRangeCancel"
          @ok="handlePeriodsRangeChange"
          @click="periodsRangeVisible = true"
        />
        <ElInput
          v-model="filterText"
          class="search-input"
          type="text"
          :placeholder="t('account.enter_account_name')"
          @change="handleTreeSearch"
        />
        <ElButton
          type="primary"
          @click="handleTreeSearch"
        >
          {{ t('common.searchBtn') }}
        </ElButton>
      </div>

      <!-- 标签页 -->
      <div class="tabs-container">
        <ElTabs
          v-model="selectedTabType"
          @tab-change="handleTabChange"
        >
          <ElTabPane
            v-for="tab in tabOptions"
            :key="tab.value"
            :label="tab.label"
            :name="tab.value"
          />
        </ElTabs>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧树形结构 -->
        <div class="left-tree">
          <ElTree
            ref="treeRef"
            :data="treeData"
            :props="{
              label: 'name',
              children: 'sub_ledger_trees',
            }"
            node-key="code"
            :current-node-key="selectedTreeNode?.code"
            @current-change="handleTreeNodeSelect"
          />
        </div>

        <!-- 右侧表格区域 -->
        <div class="right-table">
          <div class="account-info">
            {{ t('account.accountName') }}: {{ selectedTreeNode?.name }}
          </div>
          
          <Grid>
            <template #table-title>
              <div class="table-title">
                {{ t('account.subsidiary_ledger') }}
              </div>
            </template>
          </Grid>
        </div>
      </div>
    </div>
    
    <Drawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElInput, ElButton, ElTabs, ElTabPane, ElTree, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSubsidiaryLedger } from '@@/account/hooks';

defineOptions({
  name: 'ISubsidiaryLedger',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  selectedTabType,
  filterText,
  selectedTreeNode,
  periodsRange,
  periodsRangeVisible,
  treeData,
  tabOptions,
  handleTreeSearch,
  handleTreeNodeSelect,
  handleTabChange,
  handlePeriodsRangeChange,
  handlePeriodsRangeCancel,
  refresh,
} = useSubsidiaryLedger();
</script>

<style scoped>
.subsidiary-ledger-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.top-search {
  display: flex;
  gap: 12px;
  margin: 16px;
  align-items: center;
}

.search-input {
  flex: 0 0 200px;
}

.tabs-container {
  margin: 0 16px;
  border-bottom: 1px solid #e5e5e5;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 16px;
  margin: 16px;
}

.left-tree {
  flex: 0 0 300px;
  border: 1px solid #e5e5e5;
  padding: 16px;
  overflow: auto;
}

.right-table {
  flex: 1;
  border: 1px solid #e5e5e5;
}

.account-info {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 500;
}

.table-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
