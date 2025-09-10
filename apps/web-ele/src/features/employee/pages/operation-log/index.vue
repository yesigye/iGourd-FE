<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useEmployeeOperationLogList } from '../../hooks/use-employee-operation-log-list';

defineOptions({
  name: 'IEmployeeOperationLog',
});

const { Grid } = useEmployeeOperationLogList();
</script>

