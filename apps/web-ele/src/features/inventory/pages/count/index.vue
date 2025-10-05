<script setup lang="ts">
import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import {
  ElButton,
  Page,
  useIgourdForm,
  useIgourdModal,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { updateCountStatus } from '../../apis/count';
import { useInventoryCountList } from '../../hooks/count/list';

defineOptions({
  name: 'IInventoryCount',
});

const { currentLoginUserApp } = useUserStore();

const { t } = useI18n();

const {
  Grid,
  gridApi,
  Drawer,
  handleEdit,
  handleBatchDelete,
  canBatchOperate,
  handleDelete,
} = useInventoryCountList();
const currentRow = ref();
const formSchema: ISchema = {
  type: 'object',
  properties: {
    form: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 20,
      },
      properties: {
        review_status: {
          type: 'string',
          required: true,

          title: "{{t('common.review_results')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: "{{t('common.approve')}}",
              value: 'APPROVED',
            },
            {
              label: "{{t('common.reject')}}",
              value: 'REJECTED',
            },
          ],
          'x-component-props': {
            placeholder: "{{t('common.form.select_required')}}",
            clearable: true,
          },
        },
        review_opinion: {
          type: 'string',
          title: "{{t('common.remarks')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          visible: false,
          'x-reactions': {
            dependencies: ['review_status'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'REJECTED'}}",
              },
            },
          },

          'x-component-props': {
            maxlength: 256,
            rows: 5,
            placeholder: "{{t('common.pleaseEnterRejectReason')}}",
            'show-word-limit': true,
          },
        },
      },
    },
  },
};
const { Form, formAPI } = useIgourdForm({
  useI18n,
  schema: formSchema,
  readPretty: false,
  initialValues: {
    review_status: 'APPROVED',
  },
  effects() {
    // onFieldValueChange('review_status', (field, form) => {
    //   debugger;
    //   if (field.value === 'REJECTED') {
    //     form.setFieldState('review_opinion', (f) => {
    //       f.visible = true;
    //     });
    //   } else {
    //     form.setFieldState('review_opinion', (f) => {
    //       f.visible = false;
    //     });
    //   }
    // });
  },
  scope: {},
});
const [Modal, modalApi] = useIgourdModal({
  fullscreenButton: false,
  isOpen: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formAPI.validate();
    const data = formAPI.values;
    data.id = currentRow.value.id;
    data.merchant_id = currentLoginUserApp.owner_id;
    updateCountStatus(data).then(() => {
      modalApi.close();
      gridApi.reload();
    });
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formAPI.setFieldState('review_opinion', (f) => {
        f.visible = false;
      });
    } else {
      formAPI.setValues({
        review_status: 'APPROVED',
      });
    }
  },
  title: '审核意见',
});
const openModal = (row) => {
  currentRow.value = row;
  modalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #modal="{ row }">
        <ElButton type="text" @click="openModal(row)">
          <i class="iconfont icon-daishenhe status_icon"></i>
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleDelete([row.id])">
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
    <Modal>
      <Form />
    </Modal>
  </Page>
</template>
