<template>
  <Page auto-content-height>
    <Grid>
    <template #table-actions>
        <div class="flex gap-4">
          <!-- <ElButton
            v-for="tab in tabOptions"
            :key="tab.value"
            :type="selectedTabType === tab.value ? 'primary' : 'default'"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </ElButton> -->
        </div>
      </template>

      <template #topRightActions>
        <ElButton type="default">
          {{ t('account.print') }}
        </ElButton>
        <ElButton type="default">
          {{ t('account.export') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useFlows } from '@@/account/hooks';

defineOptions({
  name: 'IFlows',
});

const { t } = useI18n();

const { Grid, Drawer } = useFlows();
</script>
