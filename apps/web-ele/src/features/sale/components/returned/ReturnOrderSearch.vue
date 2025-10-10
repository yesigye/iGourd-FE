<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElMessage,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import code from '#/assets/sale/code.svg';
// props
interface Props {
  orderItemModelList: [];
}

const props = defineProps<Props>();

// 控制表格行是否可选
// const selectable = (row: any, index: number) => {
//   if (isSingleSelection.value) {
//     return selectRows.value.length === 0 || selectRows.value.includes(row);
//   }
//   return true;
// };
// 生命周期

// emits
const emit = defineEmits(['searchOrder', 'selectRows']);
// data
const { t } = useI18n();
const keywords = ref('');
const dropdown1 = ref();
const tableRef = ref();
const selectRows: any = ref([]);
// 新增单选模式标志
const isSingleSelection = ref(false);
const refundType = ref([
  {
    label: 'returned.original-order',
    value: 'original_order',
  },
  {
    label: 'returned.non-original-order',
    value: 'non_original_order',
  },
]);
const refundTypeValue = ref('original_order');
const refundTypeText = ref(t('returned.original-order'));
const handleCommand = (item: any) => {
  refundTypeValue.value = item.value;
  refundTypeText.value = item.label;
};
// computed
const filteredOrderItems = computed(() => {
  return props.orderItemModelList?.filter((item: any) => item.quantity !== 0);
});

// methods
function showClick() {
  if (!dropdown1.value) return;
  dropdown1.value.handleOpen();
}

function searchOrder(val: string) {
  if (keywords.value === '') {
    ElMessage.warning(t('returned.please-input-order-no'));
    return;
  }
  emit('searchOrder', { val, type: refundTypeValue.value });
}

const handleSearchOrder = (val: string) => {
  if (val === '') {
    ElMessage.warning(t('returned.please-input-order-no'));
    return false;
  }
  selectRows.value = [];
  searchOrder(val);
  showClick();
};

const handleCancel = () => {
  dropdown1.value.handleClose();
};

const handleSelect = (val: any[], row?: any) => {
  if (row) {
    // 单击选择
    selectRows.value = isSingleSelection.value ? [row] : val;
  } else {
    // 全选
    selectRows.value = val;
    isSingleSelection.value = false;
  }
  dropdown1.value.handleOpen();
};

const handleConfirm = () => {
  emit('selectRows', { val: selectRows.value, type: refundTypeValue.value });
  dropdown1.value.handleClose();
  // 取消选中
  selectRows.value = [];
};

const handleRowClick = (row: any) => {
  if (tableRef.value) {
    // 如果点击的是已选中的行，则取消选中
    if (selectRows.value.includes(row)) {
      tableRef.value.toggleRowSelection(row, false);
      selectRows.value = selectRows.value.filter((item: any) => item !== row);
    } else {
      tableRef.value.toggleRowSelection(row, true);
      selectRows.value.push(row);
    }
  }
  dropdown1.value.handleOpen();
};

const route = useRoute();
// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    const orderNo = newQuery.orderNo as string;

    keywords.value = orderNo || '';
  },
  { deep: true }, // 深度监听对象变化
);
onMounted(() => {
  // 订单的orderNo
  const orderNo = route.query.orderNo as string;
  if (orderNo) {
    keywords.value = orderNo;
    handleSearchOrder(orderNo);
  }
});
</script>

<template>
  <section class="returned-search w-full">
    <div class="flex w-full items-center">
      <div class="flex w-full items-center gap-2.5">
        <div
          class="border-border flex flex-1 items-center rounded border border-solid"
        >
          <ElDropdown
            class="border-border min-w-[120px] border-r border-solid p-3"
            @command="handleCommand"
          >
            <div class="flex w-full items-center justify-center">
              <span class="el-dropdown-link">
                {{ t(refundTypeText) }}
                <ElIcon class="el-icon--right">
                  <arrow-down />
                </ElIcon>
              </span>
            </div>

            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem
                  :command="item"
                  v-for="(item, index) in refundType"
                  :key="item.value"
                >
                  {{ t(item.label) }}
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
          <ElDropdown
            ref="dropdown1"
            trigger="contextmenu"
            placement="bottom-start"
            style="width: 100%"
          >
            <div class="el-dropdown-link flex w-full">
              <img :src="code" class="h-8 w-[67px]" alt="" />
              <ElInput
                v-model="keywords"
                clearable
                style="width: 100%; margin-left: 0"
                class="w-full border-none"
                :border="false"
                :input-style="{ boxShadow: 'none' }"
                :placeholder="
                  refundTypeValue === 'original_order'
                    ? $t('returned.please-input-order-no')
                    : $t('returned.barcode-product-code-product-name')
                "
                @keyup.enter="handleSearchOrder(keywords)"
              />
            </div>
            <template #dropdown>
              <ElDropdownMenu class="w-full max-w-[800px] p-0">
                <ElTable
                  ref="tableRef"
                  :data="filteredOrderItems"
                  @row-click="handleRowClick"
                  @select-all="handleSelect"
                  @select="handleSelect"
                >
                  <ElTableColumn type="selection" align="center" width="55" />
                  <ElTableColumn
                    :label="$t('common.product-name')"
                    prop="product_name"
                  />
                  <ElTableColumn
                    :label="$t('common.product-code')"
                    prop="product_code"
                  />
                  <ElTableColumn :label="$t('common.qty')" prop="quantity" />
                  <ElTableColumn
                    :label="$t('common.total-amount')"
                    prop="total_amount"
                  />
                </ElTable>
                <div class="p-2.5 text-right">
                  <ElButton class="cancel-btn" @click="handleCancel">
                    {{ $t('common.cancel') }}
                  </ElButton>
                  <ElButton class="save-btn" @click="handleConfirm">
                    {{ $t('common.confirm') }}
                  </ElButton>
                </div>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <ElButton
          class="h-[42px] w-[120px]"
          type="primary"
          @click="handleSearchOrder(keywords)"
        >
          <div class="flex items-center gap-2">
            <div class="inner-left">
              <i class="iconfont icon-sousuo"></i>
            </div>
            <div class="inner-right">
              <span> {{ $t('common.search') }}</span>
            </div>
          </div>
        </ElButton>
      </div>
    </div>
  </section>
</template>
<style>
.returned-search {
  .el-input__wrapper {
    padding-left: 0 !important;
    box-shadow: none !important;
  }
}
</style>
