<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  Card,
  ElDescriptions,
  ElDescriptionsItem,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const { t } = useI18n();
const info = ref<any>({});
const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange(isOpen) {
    if (isOpen) {
      info.value = drawerApi.getData().info;
    }
  },
});
const creditAccount = computed(() => {
  // 按逗号分隔，返回新的数组
  return info.value.ledger_names?.split(',') || [];
});
</script>
<template>
  <Drawer>
    <Card :header="t('common.basic-information')" class="border-0">
      <ElDescriptions :column="1" :label-width="144" border>
        <ElDescriptionsItem :label="t('account.revenue-and-expenditure')">
          {{ t(`enum.account-classification-types.${info.type}`) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('account.name')">
          {{ info.name }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </Card>
    <Card :header="t('account.accounting-binding')" class="border-0">
      <ElDescriptions :column="1" :label-width="144" border>
        <ElDescriptionsItem :label="t('account.classification-form.debit')">
          <p
            v-for="(item, index) in creditAccount"
            :key="item"
            class="py-1"
            :class="
              index + 1 !== creditAccount.length
                ? 'border-b border-gray-200'
                : 'pb-0'
            "
          >
            {{ item }}
          </p>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('account.classification-form.credit')">
          <p>{{ info.target_ledger_name }}</p>
        </ElDescriptionsItem>
      </ElDescriptions>
    </Card>
  </Drawer>
</template>
