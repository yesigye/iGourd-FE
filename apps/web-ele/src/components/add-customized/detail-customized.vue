<script setup lang="ts">
import { defineExpose, ref } from 'vue';
import {
  useIgourdDrawer,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
const detailData = ref(null);
const selectionOptions = ref([]);
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(isOpen, a, b) {
    if (isOpen) {
      const data = drawerApi.getData();
      debugger;
      if (data.options) {
        const options = JSON.parse(data.options);
        options.forEach((item) => {
          selectionOptions.value.push({
            name: item,
          });
        });
      }
      detailData.value = data;
    }
  },
});
</script>

<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%">
      <ElDescriptions title="" :column="1" border>
        <ElDescriptionsItem :label="t('add-customized.feature-name')">
          {{ detailData.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('add-customized.feature-type')">
          {{ detailData?.type?.value }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('add-customized.selection-type')">
          {{ detailData?.is_fixed_option?.value }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('add-customized.selection-options')"
          class-name="my-content"
        >
          <ElDescriptions title="" :column="1" border>
            <ElDescriptionsItem
              :label="t('add-customized.feature-name')"
              v-for="opt in selectionOptions"
            >
              {{ opt.name }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('add-customized.compulsory-selection')">
          {{ detailData?.is_compulsory?.value }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </Drawer>
</template>
