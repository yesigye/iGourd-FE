<script lang="ts" setup>
import { Page } from '@igourd/common-ui';
defineOptions({
  name: 'EmployeeList',
});
//@ts-ignore
const url = `${import.meta.env.VITE_APP_PASSPORT_URL}/employee`;
</script>

<template>
  <Page auto-content-height>
    <micro-app name="employee" iframe url="https://test-passport.seller100.com/employee"></micro-app>
  </Page>
</template>
