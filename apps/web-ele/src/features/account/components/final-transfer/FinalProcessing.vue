<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

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
import { debounce } from '@igourd/utils';

import {
  carryOverProfitPreCheck,
  executePeriodCloseUsingPOST,
  executeProfitLossCarryForward,
  getFinanceNoteList,
  listAccountingPeriods,
  listSubLedgerTree,
  trialBalanceCheck,
  validateBeforeClosing,
} from '@@/account/apis/final-transfer';
// 组件部分
// import { IgourdElTable } from 'igourd-ui';
import { useFinalTransfer } from '@@/account/hooks';

import FinalButton from './FinalButton.vue';
import { accountNoteColumns } from './utils/columns';
import { TREE_CHILDREN_KEY } from './utils/const';
import { transferType } from './utils/transferType';
import { transformDataToTableTree } from './utils/transformData';

const props = defineProps({
  mode: {
    type: String,
    default: 'finalProcessing',
  },
});
const { Grid, gridApi } = useFinalTransfer(props.periodId);
const accountNoteTipsVisible = ref(false);
const userStore = useUserStore();
const { t } = useI18n();
const router = useRouter();
const transferList = ref({});

/**
 * 选择的会计期间
 */
const accountingPeriod = ref({});
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
const isCompleted = computed(() => {
  let isCompleteds = true;
  checkItems.value.not_is_only_message.forEach((item) => {
    if (!item.is_passed) {
      isCompleteds = false;
    }
  });
  return isCompleteds;
});

/**
 * 默认时间 选择的会计期间的年份+月份+1
 *
 */
const defaultTime = computed(() => {
  return new Date(
    Number(accountingPeriod.value.year),
    accountingPeriod.value.monty_no,
    1,
  );
});
// 获取当前账套所有的会计期间
const getListAccountingPeriods = async () => {
  const res = await listAccountingPeriods(
    {
      account_set_id: userStore.merchantInfo.account_set_id,
    },
    { cancelDuplicate: false },
  );
  transferList.value = groupByYear(res || []);
  // 根据分组后的年 从大到小
  // 按照年份分组
};
const tooltipText =
  ref(`<div class="tooltip-text">${t('final-transfer.tooltip-dark-blue-text')}
${t('final-transfer.tooltip-light-blue-text')}</div>`);

// 结转步骤
const step = ref(1);
// 上一步骤
const previousStep = ref(1);
// 添加动画控制变量
const showCheckItems = ref<boolean[]>([]);

// 监听步骤变化，当进入步骤4时触发动画
watch(step, async (newStep) => {
  if (newStep === 4) {
    // 重置显示状态
    showCheckItems.value = [];
    await nextTick();
    // 逐个显示检查项
    animateCheckItems();
  }
});

// 逐行显示动画函数
const animateCheckItems = () => {
  const totalItems = 6; // 总共6个检查项（每列3个）
  let currentIndex = 0;

  const showNextItem = () => {
    if (currentIndex < totalItems) {
      showCheckItems.value[currentIndex] = true;
      currentIndex++;
      setTimeout(showNextItem, 300); // 每300ms显示下一项
    }
  };

  showNextItem();
};
const showCarryForwardProgressDialog = ref(false);
// 进度
const progress = ref(1);
let timer: any = null;
const mockProgress = () => {
  timer = setInterval(() => {
    const randomIncrement = Math.floor(Math.random() * 9) + 10;
    if (progress.value + randomIncrement < 99) {
      progress.value += randomIncrement;
    } else {
      clearInterval(timer);
      // finishProgress()
    }
  }, 500);
};
/**
 * 记录步骤
 * @param previousStepNum 上一步
 * @param stepNum 当前步骤
 */
const recordStep = (previousStepNum: number, stepNum: number) => {
  previousStep.value = previousStepNum;
  step.value = stepNum;
};
// 结转损益数据
const carryOverProfitData = ref({});
const isBatchPeriodClose = ref(false);
/**
 * 结转损益前校验
 */
const handCurrentAccountingPeriod = async () => {
  try {
    const res = await carryOverProfitPreCheck({
      account_set_id: userStore.merchantInfo.account_set_id,
      accounting_period_id: accountingPeriod.value.id,
    });
    // if (res.code == 'SUCCESS') {
    if (res.is_carry_over) {
      recordStep(1, 3);
      isBatchPeriodClose.value = res.is_batch_period_close;

      const data = await listSubLedgerTree({
        category: 'PROFIT_AND_LOSS',
        account_set_id: userStore.merchantInfo.account_set_id,
        accounting_period_id: accountingPeriod.value.id,
      });
      carryOverProfitData.value = transformDataToTableTree(data);
    } else {
      isBatchPeriodClose.value = res.is_batch_period_close;
      recordStep(1, 3.1);
    }
    // }
  } catch (error) {
    console.log(error);
  }
};
/**
 * 悄悄摸摸执行结转损益
 */
const handiSlentProfitLossTransfer = async () => {
  const res = await executeProfitLossCarryForward({
    account_set_id: userStore.merchantInfo.account_set_id,
    accounting_period_id: accountingPeriod.value.id,
    is_skip_pre_check: false,
  });

  // if (res.code === 'SUCCESS') {
  recordStep(3.1, 4);
  handCheckBeforeCheckout();
  showBatchClosingDialog.value = isBatchPeriodClose.value;
  // }
};
// 结转损益执行
const handExecuteProfitLossCarryForward = async () => {
  const res = await executeProfitLossCarryForward({
    account_set_id: userStore.merchantInfo.account_set_id,
    accounting_period_id: accountingPeriod.value.id,
    is_skip_pre_check: false,
  });
  // if (res.code === 'SUCCESS') {
  recordStep(3, 4);
  handCheckBeforeCheckout();
  showBatchClosingDialog.value = isBatchPeriodClose.value;
  // }
};
const checkItems = ref({ not_is_only_message: [], is_only_message: [] });
// 结账前校验
const handCheckBeforeCheckout = async () => {
  const res = await validateBeforeClosing({
    account_set_id: userStore.merchantInfo.account_set_id,
    accounting_period_id: accountingPeriod.value.id,
    is_skip_pre_check: false,
  });
  // 根据is_only_message进行分组
  const group = res.check_items.reduce((groups, item) => {
    const key = item.is_only_message
      ? 'is_only_message'
      : 'not_is_only_message';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  checkItems.value.not_is_only_message = group.not_is_only_message ?? [];
  checkItems.value.is_only_message = group.is_only_message ?? [];
};
const showBatchClosingDialog = ref(false);
const disabledDate = (time: Date) => {
  // 如果没有选中的反结转期间，禁用所有日期
  // 年份
  const year = time.getFullYear();
  // 月份
  const month = time.getMonth() + 1;
  const isYear = Number(accountingPeriod.value.year) === year;
  const isMonth = accountingPeriod.value.monty_no < month;
  const isFindMonth = transferList.value[accountingPeriod.value.year].findIndex(
    (item) => item.monty_no == month,
  );
  return isMonth || !isYear || isFindMonth === -1;
};
const period = ref('');
//
const onBatchClosingInitiated = async () => {
  // 需要批量结账的会计期间
  const accountingPeriodList = transferList.value[
    accountingPeriod.value.year
  ].filter((item) => item.monty_no <= period.value);
  // 然后根据monty_no从小到大排序
  accountingPeriodList.sort((a, b) => a.monty_no - b.monty_no);
  let index = 0;
  for (const element of accountingPeriodList) {
    try {
      const res = await executePeriodCloseUsingPOST({
        account_set_id: userStore.merchantInfo.account_set_id,
        accounting_period_id: element.id,
        is_skip_pre_check: false,
      });
      accountingPeriodList[index].id = res.data.accounting_period_id;
      index = index + 1;
    } catch (error) {
      showBatchClosingDialog.value = false;
      ElMessage.error(error.message);
      return false;
    }
  }
  if (index == accountingPeriodList.length) {
    showBatchClosingDialog.value = false;
    // 重新获取会计期间列表
    await getListAccountingPeriods();
    // 重置到第一步
    step.value = 1;
    // 清空当前选择的会计期间
    accountingPeriod.value = {};
    // 清空试算平衡结果
    trialBalanceCheckRes.value = {};
  }
};
const handCloseBatchClosingDialog = async () => {
  showBatchClosingDialog.value = false;
  isBatchPeriodClose.value = false;
  // 重新获取会计期间列表
  await getListAccountingPeriods();
  // 重置到第一步
  step.value = 1;
  // 清空当前选择的会计期间
  accountingPeriod.value = {};
  // 清空试算平衡结果
  trialBalanceCheckRes.value = {};
};
/**
 * 执行结账
 */
const handExecutePeriodClose = async () => {
  const res = await executePeriodCloseUsingPOST({
    account_set_id: userStore.merchantInfo.account_set_id,
    accounting_period_id: accountingPeriod.value.id,
    is_skip_pre_check: false,
  });
  // 如果成功初始化页面 并重新执行获取当前账套所有的会计期间
  // 重新获取会计期间列表
  await getListAccountingPeriods();
  // 重置到第一步
  step.value = 1;
  // 清空当前选择的会计期间
  accountingPeriod.value = {};
  // 清空试算平衡结果
  trialBalanceCheckRes.value = {};
};

const finishProgress = async () => {
  progress.value = 100;
  showCarryForwardProgressDialog.value = false;
  setTimeout(async () => {
    clearInterval(timer);
    progress.value = 0;
    if (trialBalanceCheckRes.value?.is_overall_balanced) {
      handCurrentAccountingPeriod();
    } else {
      recordStep(1, 2);
    }
  }, 500);
};
// 试算平衡结果
const trialBalanceCheckRes = ref({});
/**
 * 试算平衡
 */
const handfinalTransferClick = async (event) => {
  if (!event.is_locked) {
    showCarryForwardProgressDialog.value = true;
    accountingPeriod.value = event;
    mockProgress();
    try {
      const res = await trialBalanceCheck(
        {
          account_set_id: userStore.merchantInfo.account_set_id,
          accounting_period_id: event.id,
          check_sections: ['OPENING_BALANCE'],
        },
        { hideLoading: true },
      );
      // 如果报错
      trialBalanceCheckRes.value = res;
      clearInterval(timer);
      finishProgress();
    } catch {
      clearInterval(timer);
      progress.value = 0;
    }
  }
};

const handProcess = () => {
  router.push({
    path: '/account/chart-of-accounts',
  });
};
const handPreviousStep = debounce(() => {
  if (step.value === 4) {
    const stepValue = previousStep.value;
    step.value = previousStep.value;
    previousStep.value = 1;
  } else {
    step.value = previousStep.value;
    previousStep.value = 1;
  }
}, 500);
const handCarryForward = debounce(() => {}, 500);
const params = ref({
  change_type: '',
  end_time: '',
  finance_category_id: null,
  keywords: '',
  start_time: '',
  type: '',
  page_num: 1,
  page_size: 10,
  accounting_period_id: '',
  review_status_list: ['PENDING'],
});
const noteList = ref([]);
/**
 * 获取记账笔记
 */
const getAccountNoteList = async () => {
  params.value.accounting_period_id = accountingPeriod.value.id;
  const data = await getFinanceNoteList({ ...params.value });
  if (data) {
    noteList.value = data;
  }
};
const handClickQuestion = () => {
  params.value.page_num = 1;
  getAccountNoteList();
  accountNoteTipsVisible.value = true;
};
const handleCurrentChange = (num, size) => {
  params.value.page_num = num;
  params.value.page_size = size;
  getAccountNoteList();
};
const handClickGoAndOperate = () => {
  router.push({
    path: '/account/notes',
    query: {
      date: `${accountingPeriod.value.period}-01`,
    },
  });
};
watch(
  () => props.mode,
  () => {
    if (props.mode == 'finalProcessing') {
      step.value = 1;
      getListAccountingPeriods();
    }
  },
);
onMounted(() => {
  if (step.value === 1) {
    getListAccountingPeriods();
  }
});
</script>
<template>
  <!-- 结转描述 -->
  <section
    class="border-border-gray flex items-center gap-5 overflow-auto border-b pb-4 pt-4 text-sm"
  >
    <div class="flex items-center gap-2">
      <div class="bg-success h-1.5 w-1.5 rounded-md"></div>
      {{ t('final-transfer.uncarried-forward-gains-losses') }}
    </div>
    <div class="flex items-center gap-2">
      <div class="bg-primary h-1.5 w-1.5 rounded-md"></div>
      <p>{{ t('final-transfer.profits-losses-transferred-not-settled') }}</p>
      <ElTooltip :content="tooltipText" :raw-content="true" effect="customized">
        <ElIcon>
          <WarningFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="flex items-center gap-2">
      <div class="h-1.5 w-1.5 rounded-md bg-[#9E9E9E]"></div>
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
          class="mb-5 mr-[70px] w-[88px] overflow-hidden rounded-sm"
          :class="[transferType(listItem).cursor]"
          @click="handfinalTransferClick(listItem)"
        >
          <div
            class="flex h-6 items-center justify-center rounded-t-sm"
            :class="[transferType(listItem).bgColor]"
          >
            <ElIcon v-if="transferType(listItem).isDisable">
              <Lock />
            </ElIcon>
          </div>
          <div
            class="relative flex h-[66px] items-center justify-center border border-solid text-2xl"
            :class="[
              transferType(listItem).borderColor,
              transferType(listItem).textColor,
            ]"
          >
            <img
              v-if="listItem.is_current"
              src="#/assets/account/current.png"
              class="w-13 h-13 absolute bottom-0 right-0"
              alt=""
            />
            {{ listItem?.monty_no }}
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 结转第二步 -->
  <section v-if="step === 2" class="text-center">
    <div class="mt-5 text-2xl font-bold">
      {{ t('final-transfer.step-1-pre-check') }}
    </div>
    <div class="mt-5 text-xl">{{ t('final-transfer.initial-inspection') }}</div>
    <div>
      <div
        v-if="!trialBalanceCheckRes.is_overall_balanced"
        class="mt-5 text-lg"
      >
        · {{ t('final-transfer.imbalance-at-beginning') }}
        <span class="text-primary-01 cursor-pointer" @click="handProcess">{{
          t('final-transfer.click-process')
        }}</span>
      </div>
      <div v-else class="mt-5 text-lg">
        · {{ t('final-transfer.imbalance-at-beginning') }}
        <span class="text-primary-01 cursor-pointer" @click="handProcess">{{
          t('final-transfer.click-process')
        }}</span>
      </div>
    </div>

    <div class="mt-30">
      <FinalButton
        :carry-forward-button="false"
        @previous-step="handPreviousStep"
        @carry-forward="handCarryForward"
      />
    </div>
  </section>
  <section v-if="step === 3" class="overflow-auto text-center">
    <p class="mt-5 text-2xl font-bold">
      {{ t('final-transfer.step-2-transfer-gains-losses') }}
    </p>
    <div class="m-auto mt-5 w-1/2">
      <Grid />
      <!-- <IgourdElTable
        :columns="columnsVisible()"
        :el-table-prop="{
          i18n: t,
          data: carryOverProfitData,
          width: '50%',
          rowKey: 'id',
          treeProps: {
            children: TREE_CHILDREN_KEY,
          },
        }"
      /> -->
    </div>
    <div class="mt-5 flex items-center justify-center gap-2.5">
      <FinalButton
        @previous-step="handPreviousStep"
        @carry-forward="handExecuteProfitLossCarryForward"
      />
      <ElButton
        v-if="isBatchPeriodClose"
        type="primary"
        @click="handExecuteProfitLossCarryForward"
      >
        {{ t('final-transfer.lot') }}{{ t('final-transfer.carry-forward') }}
      </ElButton>
    </div>
  </section>
  <!-- 结转第3-1步 无需结转损益 -->
  <section v-if="step === 3.1" class="text-center">
    <div class="mt-5 text-2xl font-bold">
      {{ t('final-transfer.step_1_transfer_gains_losses') }}
    </div>
    <div class="mt-5 text-xl">
      {{ t('final-transfer.no-need-carry-forward-this-period') }}
    </div>

    <div class="mt-32">
      <FinalButton
        :carry-forward-button="true"
        @previous-step="handPreviousStep"
        @carry-forward="handiSlentProfitLossTransfer"
      />
    </div>
  </section>
  <section v-if="step === 4" class="">
    <p class="mt-5 text-center text-2xl font-bold">
      {{ t('final-transfer.step-3-checkout') }}
    </p>
    <div class="mt-5 flex justify-center gap-28 text-xl">
      <div>
        <p class="text-xl">
          {{ t('final-transfer.affect-checkout-inspection') }}
        </p>
        <ul class="mt-7 text-sm">
          <transition-group name="slide-in" tag="div">
            <div
              v-for="(item, key) in checkItems.not_is_only_message"
              :key="key"
            >
              <li
                v-if="showCheckItems[key]"
                key="item-0"
                class="check-item mb-5 flex items-center gap-2"
              >
                {{ t(`account.${String(item.project).toLocaleLowerCase()}`) }}
                <span
                  v-if="item.is_passed"
                  class="text-success cursor-pointer select-none"
                >
                  {{ t('final-transfer.completed') }}
                </span>
                <span
                  v-else
                  class="flex cursor-pointer select-none items-center gap-1 text-[#F56C6C]"
                >
                  {{ t('final-transfer.uncompleted') }}
                  <span v-if="item.project == 'ACCOUNTING_NOTE'"><ElIcon @click="handClickQuestion">
                      <QuestionFilled /> </ElIcon></span>
                </span>
              </li>
            </div>
          </transition-group>
        </ul>
      </div>
      <div>
        <p class="text-xl">
          {{ t('final-transfer.only-prompt-for-inspection') }}
        </p>
        <ul class="mt-7 text-sm">
          <transition-group name="slide-in" tag="div">
            <div
              v-for="(item, index) in checkItems.is_only_message"
              :key="item.project"
            >
              <li
                v-if="showCheckItems[index]"
                key="item-3"
                class="check-item mb-5"
              >
                {{ t(`account.${String(item.project).toLocaleLowerCase()}`) }}
                <span
                  v-if="item.is_passed"
                  class="text-leaf-green cursor-pointer select-none"
                >
                  {{ t('final-transfer.completed') }}
                </span>
                <span v-else class="text-error cursor-pointer select-none">
                  {{ t('final-transfer.uncompleted') }}
                </span>
              </li>
            </div>
          </transition-group>
        </ul>
      </div>
    </div>
    <div class="mt-5 flex items-center justify-center gap-2.5">
      <FinalButton
        :carry-forward-button="isCompleted"
        @previous-step="handPreviousStep"
        @carry-forward="handExecutePeriodClose"
      />
    </div>
  </section>
  <!-- 结转进度 -->
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
  <!-- 批量结帐 -->
  <!-- 选择会计期间 -->
  <ElDialog
    v-model="showBatchClosingDialog"
    width="500"
    :title="t('final-transfer.batch-checkout')"
    :show-close="false"
    align-center
    :close-on-click-modal="false"
    @close="handCloseBatchClosingDialog"
  >
    <div class="flex justify-center">
      <ElFormItem
        required
        :label="t('final-transfer.select-checkout-year-month')"
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
      {{ t('final-transfer.batch-checkout-tip') }}
    </div>
    <div class="mt-5 flex justify-end gap-2.5">
      <ElButton type="primary" @click="handCloseBatchClosingDialog">
        {{ t('common.cancel') }}
      </ElButton>
      <ElButton type="primary" @click="onBatchClosingInitiated">
        {{ t('final-transfer.confirm') }}
      </ElButton>
    </div>
  </ElDialog>
  <!-- 确认 -->
  <ElDialog
    v-model="accountNoteTipsVisible"
    :title="t('final-transfer.prompt-message')"
    width="800"
    :before-close="handleClose"
  >
    <div class="flex gap-1">
      <ElIcon size="18px">
        <WarningFilled />
      </ElIcon>
      <div>
        <div class="pl-2">
          <p>{{ t('final-transfer.accounting_note_tip') }}</p>
          <p class="font-bold">
            {{ t('final-transfer.accounting_note_tips_action') }}
          </p>
        </div>
        <div>
          <IgourdElTable
            :columns="accountNoteColumns(t)"
            :el-table-prop="{
              i18n: t,
              data: noteList?.list,
              height: 300,
              rowKey: 'id',
              treeProps: {
                children: TREE_CHILDREN_KEY,
              },
            }"
            :pagination="{
              total: +(noteList?.total || 0),
              currentPage: +(params.page_num || 1),
              pageSize: +(params.page_size || 10),
              onChange: handleCurrentChange,
            }"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="accountNoteTipsVisible = false">
          {{ t('final-transfer.close') }}
        </ElButton>
        <ElButton type="primary" @click="handClickGoAndOperate">
          <span class="text-white">{{
            t('final-transfer.go_and_operate')
          }}</span>
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-enter-active {
  transition: all 0.5s ease-out;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-in-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 检查项样式 */
.check-item {
  animation: fadeInUp 0.5s ease-out;
}

/* 滑入动画 */
</style>
