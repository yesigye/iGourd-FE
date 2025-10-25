<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  Page,
} from '@igourd/common-ui';
import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { useLanguage } from '#/hooks';

import { useInventoryTransferList } from '../../hooks/transfer/list';

defineOptions({
  name: 'IInventoryTransfer',
});

const operationOpt = ref();
useLanguage('common.review-status-enum').then((res) => {
  operationOpt.value = res;
});
const { t } = useI18n();

const {
  Grid,
  Drawer,
  handleEdit,
  handleCreate,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventoryTransferList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleCreate()">
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
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #status="{ row }">
        {{ row.status?.label || '--' }}
      </template>
      <template #review_status="{ row }">
        <ElDropdown v-if="row.review_status.value === 'PENDING'">
          <span class="custom-dropdown">
            {{ row.review_status.label }}
            <ElIcon class="el-icon--right">
              <ArrayDown />
            </ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <template v-for="item in operationOpt" :key="item?.value">
                <ElDropdownItem
                  v-if="item.value !== 'PENDING'"
                  @click="() => openModal(row, item)"
                >
                  <div>{{ item.label }}</div>
                </ElDropdownItem>
              </template>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <div v-else>
          {{ row.review_status.label }}
        </div>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
