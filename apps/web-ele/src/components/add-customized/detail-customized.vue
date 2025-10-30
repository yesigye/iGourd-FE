<script setup lang="ts">
import { useEnum } from '#/hooks';
import { defineExpose, ref } from 'vue';
import {
  useIgourdDrawer,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
const {featureTypes,selectTypes,compulsoryTypes} = useEnum();
import { getEnumLabel } from '#/utils/global';
import Index from '../audit-dialog/index.vue';
const { t } = useI18n();
const detailData = ref(null);
const selectionOptions = ref([]);
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(isOpen, a, b) {
    if (isOpen) {
      const data = drawerApi.getData();
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
          {{ getEnumLabel(featureTypes,detailData?.type)}}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('add-customized.selection-type')">
          {{ getEnumLabel(selectTypes,detailData?.is_fixed_option)}}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          v-if="detailData?.type ==='SELECT'"
          :label="t('add-customized.selection-options')"
          class-name="descriptions-item-content"
        >
          <ElDescriptions title="" :column="1" border>
            <ElDescriptionsItem
              :label="t('add-customized.selection-options')+' '+(index+1)"
              v-for="(opt,index) in selectionOptions"
            >
              {{ opt.name }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('add-customized.compulsory-selection')">
          {{ getEnumLabel(compulsoryTypes,detailData?.is_compulsory)}}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
  </Drawer>
</template>
