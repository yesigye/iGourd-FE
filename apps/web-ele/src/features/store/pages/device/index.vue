<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useStoreDevice } from '../../hooks/device/list';

defineOptions({
  name: 'IStoreDevice',
});

const { Grid, toggleAuthorization, toggleStatus } = useStoreDevice();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <!-- <template #table-actions>
        <ElButton type="primary">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template> -->
      <template #is_authorized="{ row }">
        <i
          @click="toggleAuthorization(row)"
          class="iconfont status_icon"
          :class="row.is_authorized ? 'icon-SURE' : 'icon-fILED'"
          :style="
            row.is_authorized
              ? 'color:var(--el-color-success)'
              : 'color:var(--el-color-danger)'
          "
        ></i>
      </template>
      <template #status="{ row }">
        <i
          @click="toggleStatus(row)"
          class="iconfont status_icon"
          :class="row.status === 'ACTIVE' ? 'icon-SURE' : 'icon-fILED'"
          :style="
            row.status === 'ACTIVE'
              ? 'color:var(--el-color-success)'
              : 'color:var(--el-color-danger)'
          "
        ></i>
      </template>
    </Grid>
  </Page>
</template>
