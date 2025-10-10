<script setup lang="ts">
// import
import { computed, onMounted, ref } from 'vue';

import { ElMessage, ElTable, ElTableColumn } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { debounce } from '@igourd/utils';

import { storeToRefs } from 'pinia';

import { useOrderStore } from '#/store/sale/order';
import { formatNumber } from '#/utils';

// props

const props = defineProps({
  columnsVisible: {
    type: Array as () => [],
    default: () => {
      [];
    },
  },
  returnOrderList: {
    type: Array as () => any[],
    default: () => {
      [];
    },
  },
});

// methods
const emit = defineEmits(['update-quantity', 'remove-item']);

const { currencySymbol } = storeToRefs(useUserStore());

// data
const { t } = useI18n();
const orderStore = useOrderStore();

const params = ref({
  channel: '',
  customer_id: null,
  device_id: null,
  end_create_time: '',
  guider_id: null,
  page_num: 1,
  page_size: 10,
  keywords: '',
  merchant_id: null,
  order_no: null,
  payment_card_type: '',
  payment_third_party_type: '',
  pos_user_id: null,
  price_level_id: null,
  salesman_id: null,
  start_create_time: null,
  status: null,
  vat_configuration: '',
});

// 生命周期
onMounted(async () => {
  await fetchOrderList();
});
// emits

// computed
const allColumns = computed(() => {
  return props.columnsVisible;
});

const handleInputDebounced = debounce((row) => handleQuantityChange(row), 500);
const handleQuantityChange = (item: any) => {
  // 输入0时，删除该商品控制
  if (item.displayQuantity === null || item.displayQuantity === undefined) {
    return;
  }

  item.quantity = Math.abs(item.displayQuantity);
  if (item.quantity > item.originalQuantity || item.displayQuantity > 0) {
    ElMessage.warning(t('sales.orderRerurnPromp'));
    item.displayQuantity = -item.originalQuantity;
    item.quantity = item.displayQuantity * -1;
    emit('update-quantity', item);
    return;
  }

  if (item.quantity === 0 && item.displayQuantity === 0) {
    emit('remove-item', item);
  } else {
    // 数量变化
    emit('update-quantity', item);
  }
};

/**
 * @description: 获取订单列表
 * @return {*}
 */
const fetchOrderList = async () => {
  params.value.channel = 'WEB';
  await orderStore.getOrderList(params.value);
};
</script>

<template>
  <div class="return-order-content">
    <ElTable
      :data="props.returnOrderList"
      style="width: 100%"
      stripe
      border
      class="down-table-list"
      :header-cell-style="{
        background: '#F6F8FC',
        color: '#323232',
        height: '30px',
      }"
    >
      <template v-for="item in allColumns">
        <ElTableColumn
          v-if="item.prop === 'name' && item.isSelect"
          :key="item.prop"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        />
        <!-- subtotal -->
        <ElTableColumn
          v-else-if="item.prop === 'subtotal_amount' && item.isSelect"
          :key="item.align"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        >
          <template #default="{ row }">
            <span>{{ formatNumber(row[item.prop] || 0) }}</span>
          </template>
        </ElTableColumn>
        <!-- price -->
        <ElTableColumn
          v-else-if="item.prop === 'selling_price' && item.isSelect"
          :key="item.prop"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        >
          <template #default="{ row }">
            <span>{{ formatNumber(row[item.prop] || 0) }}</span>
          </template>
        </ElTableColumn>
        <!-- 都是等于 -->
        <!-- other_tax_amount -->
        <ElTableColumn
          v-else-if="item.prop === 'other_tax_amount' && item.isSelect"
          :key="item.prop"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        >
          <template #default="{ row }">
            <span>{{ formatNumber(row[item.prop] || 0) }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="item.prop === 'promotion_discount_amount' && item.isSelect"
          :key="item.prop"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        >
          <template #default="{ row }">
            <span>{{ formatNumber(row[item.prop] || 0) }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="
            item.prop !== 'name' &&
            item.prop != 'subtotal_amount' &&
            item.prop != 'selling_price' &&
            item.prop != 'other_tax_amount' &&
            item.prop != 'promotion_discount_amount' &&
            item.isSelect
          "
          :key="item.align"
          :prop="item.prop"
          :label="t(`${item.key}.${item.localKey}`)"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
        />
      </template>
      <ElTableColumn
        :label="t('common.qty')"
        fixed="right"
        align="center"
        width="200"
      >
        <template #default="scope">
          <!-- :disabled="
              scope.row.disabled ||
              (scope.row.promotion_id != '' && scope.row.promotion_id != 0)
            " -->
          <!-- 退货数量 -->
          <el-input-number
            v-model="scope.row.displayQuantity"
            :step="-1"
            @input="handleInputDebounced(scope.row)"
          />
        </template>
      </ElTableColumn>
      <!-- :disabled="scope.row.disabled || scope.row.promotion_id != ''" -->
    </ElTable>
  </div>
</template>

<style scoped lang="scss">
.return-order-content {
  margin-top: 10px;

  :deep(.el-table .el-table__header) {
    width: 100% !important;
  }

  :deep(.el-table .el-table__body) {
    width: 100% !important;
  }
}
</style>
