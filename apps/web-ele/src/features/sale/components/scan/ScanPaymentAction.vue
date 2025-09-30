<template>
  <div class="scan-payment-action">
    <div class="scan-payment-action-left">
      <ScanSettlePay
        ref="settlePay"
        :symbol="symbol"
        :goods-list="props.goodsList"
        :row-selection="props.rowSelection"
      />
    </div>
    <div class="scan-payment-action-right">
      <div v-auth="'sale_scan_code_empty'" class="scan-payment-action-right-item">
        <el-button class="btn-action-right" @click="handleEmpty">
          {{ t('sales.empty') }}
        </el-button>
      </div>
      <div v-auth="'sale_scan_code_settlement'" class="scan-payment-action-right-item-min">
        <el-button
          class="btn-action"
          :class="{ 'btn-action-selected': hasSelectedItems }"
          :disabled="!hasSelectedItems || hasOffSaleItems"
          @click="handleSettle"
        >
          {{ t('sales.settlement') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
import ScanSettlePay from './ScanSettlePay.vue';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
// props

const props = defineProps({
  goodsList: {
    type: Array,
    default: () => []
  },
  rowSelection: {
    type: Array,
    default: () => []
  },
  symbol: {
    type: String,
    default: ''
  },
  hasOffSaleItems: {
    type: Boolean,
    default: false
  }
});

// data
const { t } = useI18n();
const settlePay = ref<{ calculateOrderList: any } | null>(null);

// 生命周期

// emits
const emit = defineEmits(['handleSettlePay', 'handleSettleEmpty']);

// computed
const hasSelectedItems = computed(() => {
  return props.goodsList.length > 0;
});

// methods
const handleSettle = () => {
  if (hasSelectedItems.value) {
    emit('handleSettlePay');
  }
};
function clearSettle() {
  if (settlePay.value) {
    settlePay.value.calculateOrderList = {};
  }
}

const handleEmpty = () => {
  clearSettle();
  emit('handleSettleEmpty');
};

defineExpose({
  clearSettle
});

// watch

// events
</script>

<style scoped lang="scss">
.scan-payment-action {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  .scan-payment-action-left {
    width: 50%;
  }
  .scan-payment-action-right {
    // padding-top: 40px;
    display: flex;
    .scan-payment-action-right-item-min {
      min-width: 130px;
    }
    .scan-payment-action-right-item {
      margin-block: auto;
      .btn-action {
        width: 100%;
        height: 90px;
        font-size: 20px;
        color: #ffffff;
        transition: background-color 0.3s ease;

        &.btn-action-selected {
          background-color: #fc5c65;
          &:hover {
            background-color: #eb3b5a;
          }
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          &:hover {
            background-color: #ccc;
          }
        }
        // &:nth-child(1) {
        //   background: #fc5c65;
        //   &:hover {
        //     background-color: rgb(230, 93, 93);
        //     color: #ffffff;
        //   }
        //   &:focus {
        //     background-color: #c59393;
        //     color: #ffffff;
        //   }
        // }
        &:nth-child(2) {
          background-color: #5492ff;
          &:hover {
            background-color: #2b76f7;
            color: #ffffff;
          }
          &:focus {
            background-color: #1263f0;
            color: #ffffff;
          }
        }
      }
      .btn-action-right {
        width: auto;
        height: 90px;
        color: #fc5c65;
        font-size: 20px;
        margin-right: 10px;
        &:nth-child(1) {
          background: #ffd8d8;
          &:hover {
            background-color: #f34750;
            color: #ffffff;
          }
          &:focus {
            background-color: #f3969a;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
