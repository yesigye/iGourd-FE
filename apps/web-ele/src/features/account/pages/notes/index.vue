<script setup lang="ts">
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  Page,
} from '@igourd/common-ui';
import { ArrayDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import { reviewAccountingNoteApi } from '@@/account/apis';
import { useAccountNotes } from '@@/account/hooks';

interface AccountNoteItem {
  id: number;
  customer_id: number;
  customer_name: string;
  creator_id: number;
  creator_name: string;
  create_time: string;
  review_status: string;
  review_reason: string;
}
defineOptions({
  name: 'IAccountNotes',
});

const { t } = useI18n();
const {
  Grid,
  Drawer,
  gridApi,
  handleEdit,
  canBatchOperate,
  handleBatchDelete,
} = useAccountNotes();
const handleReviewStatusChange = async (event: {
  data: AccountNoteItem;
  status: string;
}) => {
  try {
    const res = await reviewAccountingNoteApi({
      id: event.data.id,
      review_status: event.status,
      review_opinion: '1111',
    });
    gridApi.reload();
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
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
        <ElButton
          type="text"
          :disabled="row.review_status !== 'PENDING'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
      <template #reviewer="{ row }">
        <div v-if="row.review_status === 'PENDING'">
          <ElDropdown @command="handleReviewStatusChange">
            <div class="flex items-center gap-2.5">
              <span class="el-dropdown-link">
                {{
                  t(`enum.account-note-review-status.${row.review_status}`) ||
                  '-'
                }}
              </span>
              <ArrayDown />
            </div>

            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem :command="{ status: 'REJECTED', data: row }">
                  {{ t(`enum.account-note-review-status.REJECTED`) || '-' }}
                </ElDropdownItem>
                <ElDropdownItem :command="{ status: 'APPROVED', data: row }">
                  {{ t(`enum.account-note-review-status.APPROVED`) || '-' }}
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <div v-else-if="row.review_status === 'APPROVED'" class="text-success">
          {{ t(`enum.account-note-review-status.${row.review_status}`) || '-' }}
        </div>
        <div class="text-red-800" v-else>
          {{ t(`enum.account-note-review-status.${row.review_status}`) || '-' }}
        </div>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
