<template>
  <div class="scan-settle-content">
    <div class="scan-settle-content-item">
      <p>{{ t('sales.customerName') + ':' }}</p>
      <p>{{ customerName ? customerName : '-' }}</p>
    </div>
    <div class="scan-settle-content-item">
      <p>{{ t('sales.contactPhone') + ':' }}</p>
      <p>{{ customerPhone ? customerPhone : '-' }}</p>
    </div>
    <div class="scan-settle-content-item">
      <p>{{ t('sales.points') + ':' }}</p>
      <p>{{ customerPoints ? customerPoints : '-' }}</p>
    </div>
    <div class="scan-settle-content-item">
      <p>{{ t('sales.balance') + ':' }}</p>
      <p>{{ customerBalance ? customerBalance : '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  customerInfo?: {
    name?: string;
    phone_number?: string;
    points?: number;
    balance?: number;
  } | null;
}

// props
const props = defineProps<Props>();
// data
const { t } = useI18n();
// 生命周期

// emits

// computed
// 使用计算属性来处理可选链
const customerName = computed(() => props.customerInfo?.name ?? '');
const customerPhone = computed(() => props.customerInfo?.phone_number ?? '');
const customerPoints = computed(() => props.customerInfo?.points ?? 0);
const customerBalance = computed(() => props.customerInfo?.balance ?? 0);
// methods

// watch

// events
</script>

<style scoped lang="scss">
.scan-settle-content {
  padding: 7px 14px;
  font-size: 14px;
  background-color: #fff;
  .scan-settle-content-item {
    display: flex;
    height: 25px;
    width: 100%;
    line-height: 25px;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
