<script setup lang="ts">
import { ref } from 'vue';

import { ApiComponent, ElCard, ElFormItem, ElSelect } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { purchaseVendorPageList } from '@@/purchase/apis';

const props = defineProps<{
  label: string;
}>();

const { t } = useI18n();
const activeModel = defineModel<Record<string, string>>('active', {
  default: {},
});
const modelValue = defineModel<string>();
const options = ref<any[]>();
async function fetchVendors() {
  return await purchaseVendorPageList({
    page_num: 1,
    page_size: 30,
    keywords: props.label,
  }).then((res) => {
    options.value = res;
    return res;
  });
}
function handleChange(value: string) {
  activeModel.value = options.value?.find((item) => item.id === value);
}
</script>

<template>
  <ElCard class="w-full">
    <ElFormItem
      class="w-full"
      :label="t('purchase.selectVendor')"
      required
      prop="vendor_id"
    >
      <ApiComponent
        class="w-full"
        :api="fetchVendors"
        :component="ElSelect"
        v-model="modelValue"
        @change="handleChange"
        :immediate="true"
        children-field="children"
        loading-slot="suffixIcon"
        visible-event="onDropdownVisibleChange"
      />

      <div v-if="activeModel.name" class="active-warehouse-box">
        <div>
          <p>{{ t('purchase.venderName') }}：{{ activeModel.name }}</p>
        </div>
        <div>
          <p>{{ t('purchase.contactName') }}：{{ activeModel.contact_name }}</p>
          <p>
            {{ t('purchase.phoneNumber') }}：{{ activeModel.contact_telephone }}
          </p>
        </div>
      </div>
    </ElFormItem>
  </ElCard>
</template>

<style scoped>
.active-warehouse-box {
  margin-top: 8px;
}
</style>
