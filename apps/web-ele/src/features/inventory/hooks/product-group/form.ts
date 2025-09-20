import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
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
  // 数据数据处理
  // 表单提交处理
  const handleSubmit = async (values: PurchaseCodeRulesFormData) => {
    try {
      getFirstGroupList();
      getSecondGroupList();
      // 处理选项数据

      // 调用 API
      const response = await codingCategoryModify({
        ...parms,
      });
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
              },
            },
          },
          major_name: {
            type: 'string',
            title: 'paragraph break',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: 'purchase order',
              clearable: true,
            },
          },
        },
      },
    },
  };
  let id = 0;
  const loadData = async (node, resolve) => {
    const { level } = node;
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map((item) => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2,
      }));
      // 最后补充一个加载更多
      nodes.push({
        value: ++id,
        label: t('common.loadMore'),
        leaf: false,
      });
      resolve(nodes);
    }, 1000);
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
