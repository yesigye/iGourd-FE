<template>
  <Page auto-content-height>
    <div class="final-transfer-container">
      <!-- 结转描述 -->
      <section class="flex gap-5 items-center text-sm pt-4 pb-4 border-b border-border-gray overflow-auto">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-md bg-leaf-green"></div>
          {{ t('account.uncarried_forward_gains_losses') }}
        </div>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-md bg-sky-blue"></div>
          <p>{{ t('account.profits_losses_transferred_not_settled') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-md bg-silver"></div>
          <p>{{ t('account.accounts_have_been_closed') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-md bg-error"></div>
          <p>{{ t('account.current_accounting_period') }}</p>
        </div>
      </section>

      <!-- 结转日历 -->
      <section v-if="step === 1" class="mt-5">
        <div v-for="(item, key) in transferList" :key="item?.year">
          <p class="text-2xl">{{ key }}</p>
          <div class="mt-5 flex ml-12 flex-wrap">
            <div 
              v-for="listItem in transferList[key]" 
              :key="listItem?.monty_no" 
              class="w-[88px] mr-[70px] mb-5"
              :class="[transferType === 'finalProcessing' ? getTransferTypeStyle(listItem).cursor : getReverseTransferTypeStyle(listItem).cursor]"
              @click="handlePeriodClick(listItem)"
            >
              <div 
                class="h-6 rounded-t-sm flex justify-center items-center" 
                :class="[transferType === 'finalProcessing' ? getTransferTypeStyle(listItem).bgColor : getReverseTransferTypeStyle(listItem).bgColor]"
              >
                <el-icon 
                  v-if="transferType === 'finalProcessing' ? getTransferTypeStyle(listItem).isDisable : getReverseTransferTypeStyle(listItem).isDisable" 
                  :color="'white'"
                >
                  <Lock />
                </el-icon>
              </div>
              <div 
                class="h-[66px] flex items-center justify-center text-2xl border border-solid relative" 
                :class="[
                  transferType === 'finalProcessing' ? getTransferTypeStyle(listItem).borderColor : getReverseTransferTypeStyle(listItem).borderColor,
                  transferType === 'finalProcessing' ? getTransferTypeStyle(listItem).textColor : getReverseTransferTypeStyle(listItem).textColor,
                ]"
              >
                <img 
                  v-if="listItem.is_current" 
                  src="@/assets/img/current.png" 
                  class="w-13 h-13 absolute right-0 bottom-0" 
                  alt="" 
                />
                {{ listItem?.monty_no }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 结转第二步 -->
      <section v-if="step === 2" class="mt-5">
        <Grid>
          <template #table-title>
            <ElButton type="primary" @click="handleExecuteTransfer">
              {{ t('account.execute_transfer') }}
            </ElButton>
            <ElButton @click="step = 1">
              {{ t('common.back') }}
            </ElButton>
          </template>
        </Grid>
      </section>
    </div>
    
    <Drawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { Lock } from '@element-plus/icons-vue';

import { useFinalTransfer } from '@@/account/hooks';

defineOptions({
  name: 'IFinalTransfer',
});

const { t } = useI18n();

const {
  Grid,
  Drawer,
  step,
  transferType,
  transferList,
  selectedPeriod,
  handleTransferTypeChange,
  handlePeriodClick,
  handleExecuteTransfer,
  getTransferTypeStyle,
  getReverseTransferTypeStyle,
  refresh,
} = useFinalTransfer();
</script>

<style scoped>
.final-transfer-container {
  padding: 20px;
}

.bg-leaf-green {
  background-color: #10b981;
}

.bg-sky-blue {
  background-color: #0ea5e9;
}

.bg-silver {
  background-color: #94a3b8;
}

.bg-error {
  background-color: #ef4444;
}

.border-leaf-green {
  border-color: #10b981;
}

.border-sky-blue {
  border-color: #0ea5e9;
}

.border-silver {
  border-color: #94a3b8;
}

.border-error {
  border-color: #ef4444;
}

.text-leaf-green {
  color: #10b981;
}

.text-sky-blue {
  color: #0ea5e9;
}

.text-silver {
  color: #94a3b8;
}

.text-error {
  color: #ef4444;
}
</style>
