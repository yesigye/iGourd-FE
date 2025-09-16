<template>
  <Page auto-content-height>
    <Grid>
      <template #search>
        <div class="flex gap-4 items-center">
          <Input
            v-model:value="keywords"
            :placeholder="t('employee.pleaseOperationLog')"
            style="width: 300px"
            @press-enter="handleSearch(keywords)"
          />
          <Button type="primary" @click="handleSearch(keywords)">
            {{ t('employee.searchButton') }}
          </Button>
        </div>
      </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { Page, Input, Button } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useOperationLog } from '@@/employee/hooks';

defineOptions({
  name: 'IOperationLog',
});

const { t } = useI18n();

const {
  Grid,
  keywords,
  handleSearch,
} = useOperationLog();
</script>
