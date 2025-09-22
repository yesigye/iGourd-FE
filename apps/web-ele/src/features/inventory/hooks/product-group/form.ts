import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createGroup,
  getFirstGroupList,
  getSecondGroupList,
} from '../../apis/product-group';
// getFirstGroupList
// getSecondGroupList
// import {
//   codingCategoryDetail,
//   codingCategoryModify,
//   codingRuleList,
// } from '../apis/rules';
// import { createOrUpdateCustomizedField } from '../apis';

// 定义表单数据类型
interface PurchaseCodeRulesFormData {
  type: string;
  paragraph_break: string;
  code_section: string;
  use_rule: string;
  status: boolean;
  category_type: string;
  id: string;
}

export function useProductGroupForm() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const codingRuleListData = ref<PurchaseCodeRulesFormData[]>([]);
  // 表单提交处理
  const handleSubmit = async (formData: PurchaseCodeRulesFormData) => {
    try {
      let response = null;
      // 调用 API
      response = await (formData.id
        ? createGroup({
            ...formData,
          })
        : createGroup({
            ...formData,
          }));
      return response;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('code-rules.coding-rules'),
    appendToMain: true,
    class: 'w-1/2',
    async onOpenChange(isOpen) {
      if (isOpen) {}
    },
    onClosed() {
      formAPI.reset();
    },
    async onConfirm() {
      await formAPI.validate();
      drawerApi.lock();
      await handleSubmit(formAPI.values as PurchaseCodeRulesFormData)
        .then(() => {
          drawerApi.close();
        })
        .finally(() => {
          drawerApi.unlock();
        });
    },
  });
  // 表单 Schema - 基于原有的自定义字段表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormLayout',

        properties: {
          parent_id: {
            type: 'string',
            title: 'paragraph break',
            'x-decorator': 'FormItem',
            'x-component': 'Cascader',
            'x-component-props': {
              props: {
                lazy: true,
                lazyLoad: '{{loadData}}',
                // 数据转换显示
                label: 'major_name',
                value: 'id',
              },
            },
          },
          major_name: {
            type: 'string',
            title: 'paragraph break',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: 'enter',
              clearable: true,
            },
          },
        },
      },
      t,
    },
  };
  const id = 0;
  const loadData = async (node, resolve) => {
    const { value, level } = node;
    let treeData = [];
    treeData = await (level === 0
      ? getFirstGroupList({ parent_id: 0 })
      : getSecondGroupList({ parent_id: value }));
    resolve(treeData.list);
  };
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      type: '',
      paragraph_break: '',
      code_section: '',
      use_rule: '',
      status: false,
      setting_coding_rule_part_list: [],
      id: '',
    },
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
    },
    scope: { loadData },
  });
  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  return {
    Form,
    formAPI,
    Drawer,
    drawerApi,
    formSchema,
    handleSubmit,
    resetForm,
  };
}
