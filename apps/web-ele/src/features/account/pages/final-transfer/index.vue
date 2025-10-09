<script lang="ts" setup>
import { ref } from 'vue';

import { ElTabPane, ElTabs, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import FinaProcessing from '@@/account/components/final-transfer/FinalProcessing.vue';
import ReverseCarryover from '@@/account/components/final-transfer/ReverseCarryover.vue';

const { t } = useI18n();

const carryForwardType = ref('finalProcessing');
</script>
<template>
  <Page auto-content-height class="p-2">
    <section class="bg-card h-full p-2">
      <ElTabs v-model="carryForwardType">
        <ElTabPane
          :label="t('final-transfer.final-rocessin')"
          name="finalProcessing"
        >
          <FinaProcessing :mode="carryForwardType" />
        </ElTabPane>
        <ElTabPane
          :label="t('final-transfer.reverse-arryover')"
          name="reverseCarryover"
        >
          <ReverseCarryover :mode="carryForwardType" />
        </ElTabPane>
      </ElTabs>
    </section>
  </Page>
</template>
