<script lang="ts" setup>
import type { ListType, WithPrintType } from '../type';

import { ref, watch } from 'vue';

import { useI18n } from '@igourd/locales';

import cls from 'classnames';
import { ElButton, ElCol, ElRow } from 'element-plus';

import ColumnsSetting from '../../columns-setting/index.vue';
import { HideOnPrint, PrintDrawerType } from '../type';

import stys from '../index.module.scss';

const props = withDefaults(defineProps<WithPrintType<ListType>>(), {
  hideOnPrint: HideOnPrint.show,
  columns: () => [],
  data: () => ({}),
  type: PrintDrawerType.A4,
});
const { t } = useI18n();
const columnsSettingRef = ref();

const usedColumns = ref(props.columns);
watch(
  () => props.columns,
  () => {
    usedColumns.value = props.columns;
  },
  {
    deep: true,
  },
);
</script>
<template>
  <section
    v-if="usedColumns?.length"
    :class="cls(stys[props.type], stys['print-list'])"
  >
    <ColumnsSetting
      v-if="props.hideOnPrint === HideOnPrint.show"
      ref="columnsSettingRef"
      :columns="
        usedColumns?.map((item) => ({ ...item, label: t(item.label ?? '') }))
      "
      hide-fixed
      @update-columns="(col: any) => (usedColumns = col)"
    >
      <div class="text-right">
        <ElButton
          :button-props="{
            onClick: async () => columnsSettingRef?.showPop?.(),
            type: 'primary',
          }"
        >
          {{ t('webPrintTemplate.setField') }}
        </ElButton>
      </div>
    </ColumnsSetting>
    <ElRow class="stys.list-wrapper">
      <template v-for="item of usedColumns">
        <ElCol
          v-if="!item.hide"
          :key="item.prop"
          :span="props.type === PrintDrawerType.A4 ? 8 : 24"
        >
          <ElRow>
            <ElCol
              :span="item.labelCol ?? 11"
              :class="
                cls(stys.key, stys['font-base'], stys['default-font-size'])
              "
            >
              {{
                item.labelRender ? item.labelRender(item) : t(item.label ?? '')
              }}:&nbsp;
            </ElCol>
            <ElCol
              :span="item.valueCol ?? 13"
              :class="
                cls(stys.value, stys['font-base'], stys['default-font-size'])
              "
            >
              {{
                item.valueRender
                  ? item.valueRender(props.data)
                  : props.data[item.prop]
              }}
            </ElCol>
          </ElRow>
        </ElCol>
      </template>
    </ElRow>
  </section>
</template>
