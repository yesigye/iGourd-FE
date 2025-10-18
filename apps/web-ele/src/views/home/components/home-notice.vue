<script setup lang="ts">
import { ElCol, ElRow } from '@igourd/common-ui';
import { ArrayDown, ArrowRight } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import warningIcon from '#/assets/home/warning.svg';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { t } = useI18n();
</script>
<template>
  <ElRow :gutter="10">
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FEF0F0] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.stock-alert-min-stock') }} </span>
            <div><ArrayDown /></div>
          </div>
          <div class="mt-2 font-bold">
            {{ props?.data?.warning_product_quantity ?? 0 }}
          </div>
          <div class="mt-3 flex items-center gap-1 text-[#F56C6C]">
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FEF0F0] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.warning-alert-expiring-soon') }} </span>
            <div><ArrayDown /></div>
          </div>
          <div class="mt-2 font-bold">8</div>
          <div class="mt-3 flex items-center gap-1 text-[#F56C6C]">
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FCF6EC] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.unpaid-sales-order') }} </span>
          </div>
          <div class="mt-2 font-bold">8</div>
          <div class="mt-3 flex items-center gap-1 text-[#E6A23C]">
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
    <ElCol :lg="6" :xs="24" class="mb-2.5">
      <div class="flex gap-2.5 rounded-sm bg-[#FCF6EC] p-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <span> {{ t('home.goods-receipt-not-posted') }} </span>
          </div>
          <div class="mt-2 font-bold">8</div>
          <div class="mt-3 flex items-center gap-1 text-[#E6A23C]">
            {{ t('home.go-handle') }} <ArrowRight class="mt-1" />
          </div>
        </div>
        <div
          class="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-sm bg-[#FCD3D3]"
        >
          <img :src="warningIcon" alt="warning" class="w-5" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>
