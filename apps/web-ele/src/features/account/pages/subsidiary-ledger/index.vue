<script setup lang="ts">
import { ref } from 'vue';

import {
  ColPage,
  ElButton,
  ElTree,
  Card,
  ElScrollbar,
  ElAutoResizer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSubsidiaryLedger } from '@@/account/hooks';

import folderClose from '../../../../assets/inventory/folder-close.svg';
import folderOpen from '../../../../assets/inventory/folder-open.svg';

defineOptions({
  name: 'ISubsidiaryLedger',
});

const { t } = useI18n();
const {
  handleNodeClick,
  treeRef,
  Grid,
  handleEdit,
  treeList,
  tabs,
  tabsOption,
  tabsActiveKey,
} = useSubsidiaryLedger();
</script>

<template>
  <ColPage
    headerClass="px-0 py-1 bg-muted border-0"
    contentClass="pt-0"
    auto-content-height
    :left-width="20"
  >
    <template #description>
      <div>
        <div id="subsidiary-ledger" class="bg-card px-1"></div>
        <div id="subsidiary-ledger-tabs" class="bg-card h-[30px] px-1"></div>
      </div>
    </template>
    <template #left>
      <Card
        class="bg-card p-small mr-2 h-full rounded"
        header-class="text-sm"
        :header="t('account.financialCategory')"
        shadow="never"
      >
        <ElAutoResizer>
          <template #default="{ height }">
            <ElScrollbar :height="height">
              <ElTree
                ref="treeRef"
                node-key="id"
                highlight-current
                show-checkbox
                check-on-click-node
                :expand-on-click-node="false"
                :data="treeList"
                class="hidden-checkbox"
                @node-click="handleNodeClick"
              >
                <template #default="{ node }">
                  <div class="inline-flex flex-1">
                    <img
                      :src="node.expanded ? folderOpen : folderClose"
                      alt=""
                    />
                    <span class="pl-1 text-sm">{{ node.label }}</span>
                  </div>
                </template>
              </ElTree>
            </ElScrollbar>
          </template>
        </ElAutoResizer>
      </Card>
    </template>
    <Grid
      gridClass="px-0 telport-grid"
      :tabs="tabs"
      :tabs-option="tabsOption"
      v-model:tabsActiveKey="tabsActiveKey"
      tabsAppenTo="#subsidiary-ledger-tabs"
    >
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
  </ColPage>
</template>
<style lang="scss">
.p-small {
  --el-card-padding: 12px;

  .el-card__body {
    height: 100%;

    .el-tree--highlight-current.hidden-checkbox
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: var(--el-color-primary-light-7);
    }

    .hidden-checkbox {
      .el-checkbox {
        display: none;
      }

      .is-checked {
        background-color: var(--el-color-primary-light-7);
      }
    }
  }
}

.telport-grid {
  .vxe-grid--toolbar-wrapper {
    display: none;
  }
}
</style>
