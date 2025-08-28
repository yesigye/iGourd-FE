<script lang="ts" setup>
import { reactive, ref } from 'vue';

// 导入 Formily 组件
import { IGourdFormily, Page } from '@igourd/common-ui';

import dayjs from 'dayjs';

import { z } from '#/adapter/form';
import { getAllMenusApi } from '#/api';

const fetching = ref(false);

// 模拟远程获取数据
function fetchRemoteOptions({ keyword = '选项' }: Record<string, any>) {
  fetching.value = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      const options = Array.from({ length: 10 }).map((_, index) => ({
        label: `${keyword}-${index}`,
        value: `${keyword}-${index}`,
      }));
      resolve(options);
      fetching.value = false;
    }, 1000);
  });
}

// 创建标准的 Formily JSON Schema
const formilySchema = {
  type: 'object',
  // grid: {
  //   type: 'void',
  //   'x-component': 'FormGrid',
  //   'x-component-props': {
  //     minColumns: [4, 6, 10],
  //   },
  properties: {
    username: {
      type: 'string',
      title: '字符串',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入用户名',
      },
      'x-validator': 'required',
    },
    api: {
      type: 'string',
      title: 'ApiSelect',
      'x-decorator': 'FormItem',
      'x-component': 'ApiSelect',
      'x-component-props': {
        api: getAllMenusApi,
        autoSelect: 'first',
      },
    },
    remoteSearch: {
      type: 'string',
      title: '远程搜索',
      'x-decorator': 'FormItem',
      'x-component': 'ApiSelect',
      'x-component-props': {
        api: fetchRemoteOptions,
        filterOption: false,
        showSearch: true,
      },
      'x-validator': 'selectRequired',
    },
    apiTree: {
      type: 'string',
      title: 'ApiTreeSelect',
      'x-decorator': 'FormItem',
      'x-component': 'ApiTreeSelect',
      'x-component-props': {
        api: getAllMenusApi,
        labelField: 'name',
        valueField: 'path',
        childrenField: 'children',
      },
    },
    password: {
      type: 'string',
      title: '密码',

      'x-component': 'InputPassword',
      'x-component-props': {
        placeholder: '请输入密码',
      },
    },
    number: {
      type: 'number',
      title: '数字(带后缀)',

      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
    icon: {
      type: 'string',
      title: '图标',

      'x-component': 'IconPicker',
    },
    options: {
      type: 'string',
      title: '😎自定义：',

      'x-component': 'Select',
      'x-component-props': {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
    },
    radioGroup: {
      type: 'string',
      title: '单选组',

      'x-component': 'RadioGroup',
      'x-component-props': {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
    },
    radio: {
      type: 'string',
      title: '',

      'x-component': 'Radio',
    },
    checkboxGroup: {
      type: 'array',
      title: '多选组',

      'x-component': 'CheckboxGroup',
      'x-component-props': {
        name: 'cname',
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
    },
    checkbox: {
      type: 'boolean',
      title: '',

      'x-component': 'Checkbox',
      'x-validator': z
        .boolean()
        .refine((v) => v, { message: '为什么不同意？勾上它！' }),
    },
    mentions: {
      type: 'string',
      title: '提及',

      'x-component': 'Mentions',
      'x-component-props': {
        options: [
          { label: 'afc163', value: 'afc163' },
          { label: 'zombieJ', value: 'zombieJ' },
        ],
        placeholder: '请输入',
      },
    },
    rate: {
      type: 'number',
      title: '评分',

      'x-component': 'Rate',
    },
    // switch: {
    //   type: 'boolean',
    //   title: '开关',

    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     // class: 'w-auto',

    //   },
    // },
    // datePicker: {
    //   type: 'string',
    //   title: '日期选择框',

    //   'x-component': 'DatePicker',
    // },
    // rangePicker: {
    //   type: 'array',
    //   title: '范围选择器',

    //   'x-component': 'RangePicker',
    // },
    // timePicker: {
    //   type: 'string',
    //   title: '时间选择框',

    //   'x-component': 'TimePicker',
    // },
    treeSelect: {
      type: 'string',
      title: '树选择',

      'x-component': 'TreeSelect',
      'x-component-props': {
        allowClear: true,
        placeholder: '请选择',
        showSearch: true,
        treeData: [
          {
            label: 'root 1',
            value: 'root 1',
            children: [
              {
                label: 'parent 1',
                value: 'parent 1',
                children: [
                  {
                    label: 'parent 1-0',
                    value: 'parent 1-0',
                    children: [
                      { label: 'my leaf', value: 'leaf1' },
                      { label: 'your leaf', value: 'leaf2' },
                    ],
                  },
                  {
                    label: 'parent 1-1',
                    value: 'parent 1-1',
                    children: [{ label: 'ss leaf', value: 'leaf3' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    // files: {
    //   type: 'array',
    //   title: '文件上传',

    //   'x-component': 'Upload',
    //   'x-component-props': {
    //     accept: '.png,.jpg,.jpeg,.gif,.webp',
    //     api: upload_file,
    //     listType: 'picture-card',
    //     maxCount: 1,
    //     multiple: false,
    //     name: 'file',
    //     showUploadList: {
    //       showDownloadIcon: true,
    //       showPreviewIcon: true,
    //       showRemoveIcon: true,
    //     },
    //   },
    // },
    // startTime: {
    //   type: 'string',
    //   title: '开始时间',

    //   'x-component': 'RangePicker',
    // },
    // endTime: {
    //   type: 'string',
    //   title: '结束时间',

    //   'x-component': 'RangePicker',
    // },
    // },
  },
};

// 初始值
const initialValues = reactive({
  checkboxGroup: ['1'],
  datePicker: dayjs('2021-12-31'),
  files: [
    {
      name: 'example.png',
      status: 'done',
      uid: '-1',
      url: 'https://unpkg.com/@igourdjs/static-source@0.1.7/source/logo-v1.webp',
    },
  ],
  mentions: '@afc163',
  number: 3,
  options: '1',
  password: '2',
  radioGroup: '1',
  rate: 3,
  rangePicker: [dayjs('2022-01-01'), dayjs('2022-01-02')],
  startTime: dayjs('2022-01-01'),
  endTime: dayjs('2022-01-02'),
  switch: true,
  timePicker: dayjs('2022-01-01 12:00:00'),
  treeSelect: 'leaf1',
  username: '1',
});
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="对比 BaseForm 和 Formily 表单组件的功能实现。两个表单使用完全相同的 schema、验证规则和初始值，让你可以直观地对比两种实现方式的差异。"
    title="Formily vs BaseForm 对比"
  >
    <IGourdFormily
      title="Hello"
      :schema="formilySchema"
      :initial-values="initialValues"
    />
  </Page>
</template>

<style scoped>
/* 保持与原有样式的兼容性 */
:deep(.igourd-form-formily) {
  padding: 1.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

:deep(.formily-field) {
  margin-bottom: 1.5rem;
}

:deep(.formily-form-item-label) {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

:deep(.formily-form-item-required) {
  color: #ef4444;
}

:deep(.igourd-input),
:deep(.igourd-select),
:deep(.igourd-checkbox) {
  width: 100%;
}

:deep(.igourd-button) {
  margin-right: 0.5rem;
}

/* 代码样式 */
code {
  padding: 0.125rem 0.25rem;
  font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
  font-size: 0.875em;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
}

/* 列表样式 */
.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>
