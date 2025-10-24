<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElFormItem,
  ElIcon,
  ElMessage,
  ElProgress,
  ElTooltip,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  executePeriodRollBacked,
  listAccountingPeriods,
} from '@@/account/apis/final-transfer';

// 反结转日历样式公共方法
import { transferTypeReverse } from './utils/transferType';

const props = defineProps({
  mode: {
    type: String,
    default: 'finalProcessing',
  },
});
const { t } = useI18n();
const userStore = useUserStore();
const period = ref('');
const tooltipText =
  ref(`<div class="tooltip-text">${t('final-transfer.tooltip-dark-blue-text')}
${t('final-transfer.tooltip-light-blue-text')}</div>`);
// 反结转日历
const transferList = ref({});
// 原始数据
const originalData = ref({});
// 反结转进度弹窗
const showCarryForwardProgressDialog = ref(false);

// 已选中的反结转日历
const selectedPeriod = ref({});
/**
 * 会计期间分组
 */
function groupByYear(data) {
  return data.reduce((groups, item) => {
    const year = item.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
    return groups;
  }, {});
}
/**
 * 默认时间 选择的会计期间的年份+月份+1
 *
 */
const defaultTime = computed(() => {
  return new Date(
    Number(selectedPeriod.value.year),
    selectedPeriod.value.monty_no,
    1,
  );
});

/**
 * 获取当前账套的当期会计期间
 */
const getListAccountingPeriods = async () => {
  const res = await listAccountingPeriods(
    {
      account_set_id: userStore.merchantInfo.account_set_id,
    },
    { cancelDuplicate: false },
  );
  // 过滤掉已关闭的会计期间
  const closedData = res.filter((item) => item.settlement_status == 'CLOSED');
  originalData.value = groupByYear(res);
  // 按照年份分组
  transferList.value = groupByYear(closedData);
};
// 结转步骤
const step = ref(1);
// 选择会计期间弹窗
const showPeriodPicker = ref(false);
const handClosePeriodPicker = () => {
  showPeriodPicker.value = false;
};
/**
 * 可选会计期间 禁用规则
 * 规则: 只能选择大于等于选择的反结转期间月份且originalData数据中包含的月份
 */
const disabledDate = (time: Date) => {
  // 如果没有选中的反结转期间，禁用所有日期
  // 年份
  const year = time.getFullYear();
  // 月份
  const month = time.getMonth() + 1;
  const isYear = Number(selectedPeriod.value.year) === year;
  const isMonth = selectedPeriod.value.monty_no > month;
  const isFindMonth = originalData.value[selectedPeriod.value.year].findIndex(
    (item) => item.monty_no == month,
  );
  return isMonth || !isYear || isFindMonth == -1;
};
// 进度
const progress = ref(1);
let timer: any = null;
const mockProgress = () => {
  timer = setInterval(() => {
    const randomIncrement = Math.floor(Math.random() * 9) + 1;
    if (progress.value + randomIncrement < 99) {
      progress.value += randomIncrement;
    } else {
      progress.value = 99;
      clearInterval(timer);
      finishProgress();
    }
  }, 500);
};

/**
 * 反结转 选择结转日历
 */
const handfinalTransferClick = (event) => {
  selectedPeriod.value = event;
  showPeriodPicker.value = true;
};
const finishProgress = async () => {
  progress.value = 100;
  showCarryForwardProgressDialog.value = false;
  setTimeout(async () => {
    clearInterval(timer);
    progress.value = 0;
  }, 500);
};
/**
 * 执行反结转
 */
const handSubmitPeriodPicker = async () => {
  if (!period.value) {
    ElMessage.error(t('final-transfer.please-select-accounting-period'));
    return;
  }
  const selectYear = transferList.value[selectedPeriod.value.year];
  const originaYear = originalData.value[selectedPeriod.value.year];

  // 从当前年现有的会计期间中选择月份最大的会计期间
  const rollback_from_period_id = selectYear.reduce((max, current) => {
    return current.monty_no > max.monty_no ? current : max;
  }).id;
  const rollbackToPeriodId = originaYear.find(
    (item) => item.monty_no == period.value,
  ).id;
  showCarryForwardProgressDialog.value = true;
  mockProgress();
  try {
    const res = await executePeriodRollBacked(
      {
        account_set_id: userStore.merchantInfo.account_set_id,
        rollback_from_period_id,
        rollback_to_period_id: selectedPeriod.value.id,
        target_current_period_id: rollbackToPeriodId,
      },
      { hideLoading: false },
    );
    if (res.is_period_roll_backed_success) {
      await finishProgress();
      handClosePeriodPicker();
      ElMessage.success(t('final-transfer.reverse-carryover-success'));
      handClosePeriodPicker();
      getListAccountingPeriods();
    }
  } catch (error) {
    await finishProgress();
    ElMessage.error(error.message);
    console.log(error);
  }
};
watch(
  () => props.mode,
  () => {
    if (props.mode == 'reverseCarryover') {
      step.value = 1;
      getListAccountingPeriods();
    }
  },
);
</script>
<template>
  <!-- 结转描述 -->
  <section
    class="border-border-gray flex items-center gap-5 border-b pb-4 pt-4 text-sm"
  >
    <div class="flex items-center gap-2">
      <div class="bg-success h-1.5 w-1.5 rounded-md"></div>
      {{ t('final-transfer.uncarried-forward-gains-losses') }}
    </div>
    <div class="flex items-center gap-2">
      <div class="bg-primary h-1.5 w-1.5 rounded-md"></div>
      <p>{{ t('final-transfer.profits-losses-transferred-not-settled') }}</p>
      <ElTooltip :content="tooltipText" :raw-content="true" effect="customized">
        <ElIcon><WarningFilled /></ElIcon>
      </ElTooltip>
    </div>
    <div class="flex items-center gap-2">
      <div class="h-1.5 w-1.5 rounded-md bg-[#9e9e9e]"></div>
      <p>{{ t('final-transfer.accounts-have-been-closed') }}</p>
    </div>
    <div class="flex items-center gap-2">
      <div class="h-1.5 w-1.5 rounded-md bg-[#F56C6C]"></div>
      <p>{{ t('final-transfer.current-accounting-period') }}</p>
    </div>
  </section>
  <!-- 结转日历 -->
  <section v-if="step === 1" class="mt-5">
    <div v-for="(item, key) in transferList" :key="item?.year">
      <p class="text-2xl">{{ key }}</p>
      <div class="ml-12 mt-5 flex flex-wrap">
        <div
          v-for="listItem in transferList[key]"
          :key="listItem?.monty_no"
          class="mb-5 mr-[70px] w-[88px]"
          :class="[transferTypeReverse(listItem).cursor]"
          @click="handfinalTransferClick(listItem)"
        >
          <div
            class="bg-success flex h-6 items-center justify-center rounded-t-sm"
            :class="[transferTypeReverse(listItem).bgColor]"
          >
            <ElIcon v-if="transferTypeReverse(listItem).isDisable">
              <Lock />
            </ElIcon>
          </div>
          <div
            class="flex h-[66px] items-center justify-center border border-solid text-2xl"
            :class="[
              transferTypeReverse(listItem).borderColor,
              transferTypeReverse(listItem).textColor,
            ]"
          >
            {{ listItem?.monty_no }}
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 反结转进度 -->
  <ElDialog
    v-model="showCarryForwardProgressDialog"
    width="500"
    :show-close="false"
    align-center
  >
    <span>{{ t('final-transfer.data-loading-please-wait') }}</span>
    <ElProgress
      class="mt-5"
      :text-inside="true"
      :stroke-width="20"
      :percentage="progress"
    />
  </ElDialog>
  <!-- 选择会计期间 -->
  <ElDialog
    v-model="showPeriodPicker"
    width="500"
    :title="t('final-transfer.select-accounting-period')"
    :show-close="false"
    align-center
    @close="handClosePeriodPicker"
  >
    <div class="flex justify-center">
      <ElFormItem
        required
        :label="t('final-transfer.accounting-period')"
        label-position="left"
      >
        <ElDatePicker
          v-model="period"
          type="month"
          value-format="M"
          format="YYYY/MM"
          :default-value="defaultTime"
          :disabled-date="disabledDate"
        />
      </ElFormItem>
    </div>
    <div class="text-status-partial">
      {{ t('final-transfer.reverse-carryover-tip') }}
    </div>
    <div class="mt-5 flex justify-end gap-2.5">
      <ElButton type="primary" @click="handClosePeriodPicker">
        {{ t('common.cancel') }}
      </ElButton>
      <ElButton type="primary" @click="handSubmitPeriodPicker">
        {{ t('common.confirm') }}
      </ElButton>
    </div>
  </ElDialog>
</template>
