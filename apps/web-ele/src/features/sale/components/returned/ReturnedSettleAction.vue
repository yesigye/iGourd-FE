<script setup lang="ts">
import { computed } from 'vue';

import { ElButton } from '@igourd/common-ui';
// import
import { useI18n } from '@igourd/locales';

import ReturnAmount from './ReturnAmount.vue';
// props
interface Props {
  returnOrderList: any[];
  compuredReturnedinfo: {};
  orderDetail: any;
}
const props = defineProps<Props>();

// 生命周期

// emits
const emit = defineEmits(['handleRefund', 'handleEmpty']);

// data
const { t } = useI18n();

// computed
const hasSelectedItems = computed(() => {
  return props.returnOrderList.length > 0;
});

const isRefundDisabled = computed(() => {
  return (
    !hasSelectedItems.value ||
    props.orderDetail.status === 'CANCEL' ||
    props.orderDetail.status === 'PENDING' ||
    props.orderDetail.refund_status == 'ALL'
  );
});

const showRefundTooltip = computed(() => {
  const { status, refund_status } = props.orderDetail;
  if (status === 'CANCEL' || status === 'PENDING') {
    return {
      content: t(
        `sales.newValue.${refund_status == 'ALL' ? refund_status : status}`,
      ),
    };
  }
  return null;
});

// methods
const handleRefund = () => {
  emit('handleRefund');
};

const handleEmpty = () => {
  emit('handleEmpty');
};

// watch

// events
// console.log(orderDetail.value.status);

//   if (orderDetail.value.status === 'PAID'  ) {
//     ElMessage.warning('Paid orders cannot be returned');
//     return;
//   }
// 此单已退款
// 此单未付款
</script>

<template>
  <div class="flex items-center justify-between pl-5 pr-5">
    <div v-auth="'sale_scan_code_empty'" class="">
      <ElButton
        class="h-[44px] w-full"
        color="#FCD3D3"
        type="danger"
        @click="handleEmpty"
      >
        <span class="text-[#F56C6C]">{{ t('common.empty') }}</span>
      </ElButton>
    </div>
    <div class="scan-payment-action-left mr-2 flex-1">
      <ReturnAmount :compured-returnedinfo="compuredReturnedinfo" />
    </div>
    <div class="scan-payment-action-right flex-0">
      <div v-auth="'sale_scan_code_settlement'" class="w-[270px]">
        <el-tooltip
          v-if="showRefundTooltip"
          class="w-full"
          effect="dark"
          :content="showRefundTooltip.content"
          placement="top-end"
        >
          <ElButton
            class="h-[44px] w-[270px]"
            type="danger"
            :class="{ 'btn-action-selected': hasSelectedItems }"
            :disabled="isRefundDisabled"
            @click="handleRefund"
          >
            {{ t('returned.refund') }}
          </ElButton>
        </el-tooltip>
        <ElButton
          v-else
          class="h-[44px] w-[270px]"
          type="danger"
          :class="{ 'btn-action-selected': hasSelectedItems }"
          :disabled="isRefundDisabled"
          @click="handleRefund"
        >
          {{ t('returned.refund') }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scan-payment-action {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;

  .scan-payment-action-left {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    width: 50%;
  }

  .scan-payment-action-right {
    // padding-top: 40px;
    display: flex;

    .scan-payment-action-right-item {
      .btn-action {
        min-width: 130px;
        height: 100%;
        font-size: 20px;
        color: #fff;
        transition: background-color 0.3s ease;

        &.btn-action-selected {
          background-color: #fc5c65;

          &:hover {
            background-color: #eb3b5a;
          }
        }

        &:disabled {
          cursor: not-allowed;
          background-color: #ccc;

          &:hover {
            background-color: #ccc;
          }
        }

        &:nth-child(0) {
          background-color: #fc5c65;
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
        // &:nth-child(2) {
        //   background-color: #5492ff;
        //   &:hover {
        //     background-color: #2b76f7;
        //     color: #ffffff;
        //   }
        //   &:focus {
        //     background-color: #1263f0;
        //     color: #ffffff;
        //   }
        // }
      }

      .btn-action-right {
        width: auto;
        height: 90px;
        // margin-top: 9px;
        margin-right: 10px;
        font-size: 20px;
        color: #fc5c65;

        &:nth-child(1) {
          background: #ffd8d8;

          &:hover {
            color: #fff;
            background-color: #f34750;
          }

          &:focus {
            color: #fff;
            background-color: #f3969a;
          }
        }
      }
    }
  }
}
</style>
