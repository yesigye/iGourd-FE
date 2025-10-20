<script setup lang="ts">
import type {
  PrintTemplate,
  TemplateTypeItem,
  TemplateTypeListItem,
} from '@@/setting/types';

import { ref } from 'vue';

import {
  Card,
  confirm,
  ElButton,
  IgourdIcon,
  Page,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  deletePrintTemplate,
  getPrintTemplateList,
  setDefaultPrintTemplate,
} from '@@/setting/apis';
import { TemplateDrawer } from '@@/setting/components';

import { PageTitle } from '#/components';

import { templateType } from './index';

const { t } = useI18n();

const templateTypeList = ref<TemplateTypeItem[]>([
  {
    type: 'receipt',
    title: t('template.receipt'),
    key: 'receipt',
    list: [
      {
        title: t('template.cash-register-receipt'),
        key: 'cash-register-receipt',
        label: t('template.credit-sales-receipt-tip-1'),
        labelKey: 'credit-sales-receipt-tip-1',
        type: templateType.RECEIPT,
      },
      {
        title: t('template.credit-sales-receipt'),
        key: 'credit-sales-receipt',
        label: t('template.credit-sales-receipt-tip-2'),
        labelKey: 'credit-sales-receipt-tip-2',
        type: templateType.RECHARGE_RECEIPT,
      },
      {
        title: t('template.preliminary-bill'),
        key: 'preliminary-bill',
        label: t('template.preliminary-bill-tip'),
        labelKey: 'preliminary-bill-tip',
        type: templateType.PRELIMINARY_BILL_RECEIPT,
      },
      {
        title: t('template.refund-receipt'),
        key: 'refund-receipt',
        label: t('template.refund-receipt-tip'),
        labelKey: 'refund-receipt-tip',
        type: templateType.REFUND_RECEIPT,
      },
    ],
  },
  {
    type: 'label',
    title: t('template.label'),
    key: 'label',
    list: [
      {
        title: t('template.commodity-barcode-label'),
        label: t('template.commodity-barcode-label-tip'),
        key: 'commodity-barcode-label',
        labelKey: 'commodity-barcode-label-tip',
        type: templateType.BARCODE_LABEL,
      },
      {
        title: t('template.commodity-price-tag'),
        label: t('template.commodity-price-tag-tip'),
        labelKey: 'commodity-price-tag-tip',
        key: 'commodity-price-tag',
        type: templateType.PRICE_TAG,
      },
    ],
  },
]);
// 判断现在暂时小票标签类型还是 小票标签列表
const isReceiptLabelType = ref('type');

// 选择的票据或标签的信息
const selectedTemplateTypeItem = ref<TemplateTypeListItem>(
  {} as TemplateTypeListItem,
);
// 选择的模板类型标题
const selectedTemplateTypeTitle = ref('');
const handleAddTemplateList = (
  templateItem: TemplateTypeListItem,
  templateTypeTitle: string,
) => {
  selectedTemplateTypeItem.value = templateItem;
  isReceiptLabelType.value = 'list';
  selectedTemplateTypeTitle.value = templateTypeTitle;
  getTemplateList();
};
const handleChangeTemplateType = () => {
  isReceiptLabelType.value = 'type';
};
// 模板列表
const templateList = ref<{
  default: PrintTemplate[];
  other: PrintTemplate[];
}>({
  default: [],
  other: [],
});
// 根据模板类型或列表
const getTemplateList = async () => {
  const result = await getPrintTemplateList({
    type: selectedTemplateTypeItem.value.type,
  });
  templateList.value.default =
    result.filter((item: PrintTemplate) => item.is_default) || [];
  templateList.value.other =
    result.filter((item: PrintTemplate) => !item.is_default) || [];
};
// 删除模板
const handleDeleteTemplate = async (item: PrintTemplate) => {
  confirm({
    title: t('common.system-prompt'),
    content: t('template.confirm-delete'),
  }).then(async () => {
    await deletePrintTemplate({
      print_template_merchant_id_list: [item.id],
    });
    getTemplateList();
  });
};
// 设置默认模板
const handleSetDefaultTemplate = async (item: PrintTemplate) => {
  await setDefaultPrintTemplate({
    business_type: item.business_type,
    id: item.id,
  });
  getTemplateList();
};
// 添加模板那弹窗
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: TemplateDrawer,
  appendToMain: true,
});
// 打开添加模板抽屉
const handleOpenAddTemplateDrawer = () => {
  drawerApi.setData({ templateType: selectedTemplateTypeItem.value.type });
  drawerApi.open();
};
// 编辑模板
const handleEditTemplate = (item: PrintTemplate) => {
  drawerApi.setData({
    templateType: selectedTemplateTypeItem.value.type,
    currentTemplateData: item,
  });
  drawerApi.open();
};
// 抽屉保存事件
const handleSaved = () => {
  getTemplateList();
};
</script>

<template>
  <Page auto-content-height>
    <section class="h-full pl-4 pr-4" v-if="isReceiptLabelType === 'type'">
      <section v-for="item in templateTypeList" :key="item.key">
        <PageTitle :title="t(`template.${item.key}`)" />
        <div
          class="bg-card pb-4 pl-5 pr-5 pt-4 text-sm"
          v-for="templateItem in item.list"
          :key="templateItem.type"
        >
          <div class="flex items-center justify-between">
            <div class="w-[287px] font-bold">
              {{ t(`template.${templateItem.key}`) }}
            </div>
            <div class="w-[610px] text-[#999999]">
              {{ t(`template.${templateItem.labelKey}`) }}
            </div>
            <div>
              <ElButton
                type="primary"
                :plain="true"
                @click="handleAddTemplateList(templateItem, templateItem.key)"
              >
                {{ t('common.edit') }}
              </ElButton>
            </div>
          </div>
        </div>
      </section>
    </section>
    <section
      class="flex h-full flex-col gap-2.5 pl-4 pr-4"
      v-if="isReceiptLabelType === 'list'"
    >
      <section class="rounded-lg">
        <div
          class="flex items-center justify-between p-2.5 text-center text-xl"
        >
          <div></div>
          <div>{{ t(`template.${selectedTemplateTypeTitle}`) }}</div>
          <div>
            <ElButton
              type="default"
              link
              :plain="true"
              @click="handleChangeTemplateType"
            >
              <IgourdIcon
                icon="weui:previous-outlined"
                class="text-2xl"
                type="default"
              />
            </ElButton>
          </div>
        </div>

        <!-- 模板列表 -->
        <section class="bg-card px-5 py-2">
          <Card :header="t('template.default-template')" class="border-0">
            <div
              class="w-[198px]"
              v-for="item in templateList.default"
              :key="item.id"
            >
              <div
                class="flex h-[100px] items-center justify-center bg-[#D9ECFF] text-center"
              >
                <div>
                  <i
                    class="iconfont icon-mobanguanli small_mobanguanli text-primary text-[50px]"
                  ></i>
                  <p>{{ item.title_name }}</p>
                </div>
              </div>
              <div class="flex cursor-pointer text-center text-sm">
                <div
                  class="w-full flex-1 cursor-not-allowed bg-[#F2F3F5] pb-3 pt-3 text-[#A8ABB2]"
                >
                  {{ t('common.select') }}
                </div>
                <div
                  class="w-full flex-1 bg-[#FF9800] pb-3 pt-3 text-white"
                  @click="handleEditTemplate(item)"
                >
                  {{ t('common.edit') }}
                </div>
                <div
                  class="w-full flex-1 cursor-not-allowed bg-[#F2F3F5] pb-3 pt-3 text-[#A8ABB2]"
                >
                  {{ t('common.detele') }}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </section>
      <section class="rounded-lg">
        <section class="bg-card px-5 py-2">
          <Card class="border-0">
            <template #header>
              <div class="flex w-full justify-between">
                <span class="">{{ t('template.other-template') }}</span>
                <ElButton type="primary" @click="handleOpenAddTemplateDrawer">
                  {{ t('common.add') }}
                </ElButton>
              </div>
            </template>
            <div class="flex flex-wrap gap-5">
              <div
                class="w-[198px]"
                v-for="item in templateList.other"
                :key="item.id"
              >
                <div
                  class="flex h-[100px] items-center justify-center bg-[#D9ECFF] text-center"
                >
                  <div>
                    <i
                      class="iconfont icon-mobanguanli small_mobanguanli text-primary text-[50px]"
                    ></i>
                    <p>{{ item.title_name }}</p>
                  </div>
                </div>
                <div class="flex cursor-pointer text-center text-sm">
                  <div
                    class="w-full flex-1 bg-[#0D99FF] pb-3 pt-3 text-white"
                    @click="handleSetDefaultTemplate(item)"
                  >
                    {{ t('common.select') }}
                  </div>
                  <div
                    class="w-full flex-1 bg-[#FF9800] pb-3 pt-3 text-white"
                    @click="handleEditTemplate(item)"
                  >
                    {{ t('common.edit') }}
                  </div>
                  <div
                    class="w-full flex-1 bg-[#F56C6C] pb-3 pt-3 text-white"
                    @click="handleDeleteTemplate(item)"
                  >
                    {{ t('common.detele') }}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </section>
    </section>
    <Drawer @saved="handleSaved" />
  </Page>
</template>
