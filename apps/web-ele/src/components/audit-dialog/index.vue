<script setup lang="ts">
import type { ISchema } from '@igourd/common-ui';

import { defineEmits, defineExpose } from 'vue';

import { useIgourdForm, useIgourdModal } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const emit = defineEmits(['confirm']);
const { t } = useI18n();
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
  effects() {},
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
    emit('confirm', data);
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
  title: t('common.auditOpinion'),
});

const openModal = () => {
  modalApi.open();
};
const closeModal = () => {
  modalApi.close();
};
defineExpose({ openModal, closeModal });
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
<style scoped></style>
