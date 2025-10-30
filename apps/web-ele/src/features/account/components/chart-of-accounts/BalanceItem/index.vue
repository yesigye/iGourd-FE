<script setup>
import { useI18n } from '@igourd/locales';

import balanceLeft from '#/assets/account/balance-left.svg';
import balanceRight from '#/assets/account/balance-right.svg';
import balance from '#/assets/account/balance.svg';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  isBorder: {
    type: Boolean,
    default: true,
  },
});
const { t } = useI18n();
</script>
<template>
  <section>
    <div class="w-[284px] px-8" v-if="data?.difference > 0">
      <div class="py-3 text-center text-base">
        {{ t(`enum.account-trial-balancing.${data?.title}`) }}
      </div>
      <div class="mb-4 flex items-end justify-between">
        <div style="transform: translateY(39px)" class="text-left">
          <p class="mb-1">{{ data?.left_amount }}</p>
          <div
            class="bg-warning flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.left_label}`) }}
          </div>
        </div>
        <div>{{ data?.difference }}</div>
        <div class="text-right">
          <p class="mb-1">{{ data?.right_amount }}</p>
          <div
            class="bg-primary flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.right_label}`) }}
          </div>
        </div>
      </div>
      <img :src="balanceLeft" alt="" class="w-[254px]" />
    </div>
    <div class="w-[284px] px-8" v-if="data?.difference === 0">
      <div class="py-3 text-center text-base">
        {{ t(`enum.account-trial-balancing.${data?.title}`) }}
      </div>
      <div class="mb-4 mt-4 flex items-end justify-between">
        <div class="text-left">
          <p class="mb-1">{{ data?.left_amount }}</p>
          <div
            class="bg-warning flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.left_label}`) }}
          </div>
        </div>
        <div>{{ data?.difference }}</div>
        <div class="text-right">
          <p class="mb-1">{{ data?.right_amount }}</p>
          <div
            class="bg-primary flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.right_label}`) }}
          </div>
        </div>
      </div>
      <img :src="balance" alt="" class="w-[254px]" />
    </div>
    <div class="w-[284px] px-8" v-if="data?.difference < 0">
      <div class="py-3 text-center text-base">
        {{ t(`enum.account-trial-balancing.${data?.title}`) }}
      </div>
      <div class="mb-4 mt-4 flex items-end justify-between">
        <div class="text-left">
          <p class="mb-1">
            {{ data?.left_amount }}
          </p>
          <div
            class="bg-warning flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.left_label}`) }}
          </div>
        </div>
        <div>{{ data?.difference }}</div>
        <div class="text-right" style="transform: translateY(39px)">
          <p class="mb-1">
            {{ data?.right_amount }}
          </p>
          <div
            class="bg-primary flex h-[50px] w-[50px] items-center justify-center rounded-full p-1 text-[10px] text-white"
          >
            {{ t(`enum.account-trial-balancing.${data?.right_label}`) }}
          </div>
        </div>
      </div>
      <img :src="balanceRight" alt="" class="w-[254px]" />
    </div>
  </section>
</template>
