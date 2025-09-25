<!-- ui/components/ProductSelect.vue -->
<script setup lang="ts">
import { computed } from 'vue';

import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  useRecord,
} from '@igourd/common-ui';
import { EpArrayDown } from '@igourd/icons';
import { omit } from '@igourd/utils';

defineProps<{ modelValue?: string }>();
const emits = defineEmits(['change']);

// const ctx = inject<any>('ptCtx', { services: {} });
// const loading = ref(false);
const row = useRecord();

const options = computed(() => {
  const { sub_product_stock_search_models } = row.value;
  return sub_product_stock_search_models ?? [];
});

async function unitChange(item: any) {
  emits('change', item.id);
  row.value.product_unit_name = item.product_unit_name;
  // 用单位中带的产品，替换原有的产品，但是要保留原有的部分信息。
  Object.assign(
    row.value,
    omit(item, [
      'major_name',
      'product_spec_kvmessage',
      'id',
      'sub_product_stock_search_models',
    ]),
  );
}
</script>

<template>
  <span>
    <ElDropdown>
      <span class="el-dropdown-link">
        {{ row.product_unit_name }}
        <ElIcon v-if="options.length > 0" class="el-icon--right">
          <EpArrayDown />
        </ElIcon>
      </span>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="item in options"
            :key="item?.id"
            @click="() => unitChange(item)"
          >
            <div class="unit-item" style="width: 300px; overflow: scroll">
              <span>{{ item.product_unit_name }}</span>
              <span v-if="item.basic_unit_radio">
                1:{{ item.basic_unit_radio }}
              </span>
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </span>
</template>
