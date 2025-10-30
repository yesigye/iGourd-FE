<!-- ConfirmDeleteContent.vue -->
<script setup lang="ts">
import { computed } from 'vue';

import { WarningFilled } from '@igourd/icons';

interface ErrorItem {
  account_code: string;
  account_name: string;
}

const props = withDefaults(
  defineProps<{
    errorList: ErrorItem[];
    locale: (key: string) => string;
    message: string;
  }>(),
  {
    errorList: () => [],
    message: '',
    locale: (key: string) => key,
  },
);

const accountNumber = computed(() => {
  return props.errorList.map((item) => item.account_code).join(',');
});
const accountName = computed(() => {
  return props.errorList.map((item) => item.account_name).join(',');
});
</script>

<template>
  <div class="flex gap-2.5">
    <div class="shrink-0">
      <WarningFilled class="text-warning text-[16px]" />
    </div>
    <div>
      <p class="text-[16px]">
        {{ message }}
      </p>
      <p class="mt-2.5">
        <span>{{ locale('management.account-number') }}:</span>
        <span class="text-[#FC5C65]">{{ accountNumber }}</span>
      </p>
      <p class="mt-1">
        <span>{{ locale('management.account-name') }}:</span>
        <span class="text-[#FC5C65]">{{ accountName }}</span>
      </p>
    </div>
  </div>
</template>
