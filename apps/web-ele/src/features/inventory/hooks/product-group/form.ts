import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  createGroup,
  getFirstGroupList,
  getParentList,
  getSecondGroupList,
  updateGroup,
} from '@@/inventory/apis';

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

export function useProductGroupForm(func) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const codingRuleListData = ref<PurchaseCodeRulesFormData[]>([]);
  // 表单提交处理
  const handleSubmit = async (formData: PurchaseCodeRulesFormData) => {
    try {
      let response = null;
      // 父级分类 ID  组件数组中获取
      if (formData.parent_id) {
        const len = formData.parent_id.length;
        formData.parent_id = formData.parent_id[len - 1];
      }

      // 调用 API
      response = await (formData.id
        ? updateGroup({
            ...formData,
          })
        : createGroup({
            ...formData,
          }));
      func('refresh-tree');
      return response;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('product-group.add-product-group'),
    appendToMain: true,
    class: 'w-1/2',
    async onOpenChange(isOpen) {
      if (isOpen) {
        formAPI.reset();
        const data = drawerApi.getData();
        if(data && data.parent_id){
          const pIdList = await getParentList(data.parent_id);
          // pIdList.push(data.parent_id);
          data.parent_id = pIdList;
        }else{
          data.parent_id = 0;
        }

        formAPI.setValues(data);
        //  formAPI.setValuesIn('parent_id', pIdList);
      }
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
        'x-component-props': {
          labelCol: 4,
          wrapperCol: 20,
        },
        properties: {
          parent_id: {
            type: 'string',
            title: "{{t('product-group.previous-category')}}",
            // required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Cascader',
            'x-component-props': {
              props: {
                lazy: true,
                lazyLoad: '{{loadData}}',
                // 数据转换显示
                label: 'major_name',
                value: 'id',
                checkStrictly: true,
              },
            },
          },
          major_name: {
            type: 'string',
            title: "{{t('product-group.category-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('product-group.please-enter-category-name')}}",
              clearable: true,
            },
          },
        },
      },
      t,
    },
  };
  const loadData = async (node, resolve) => {
    const { value, level } = node;
    let treeData = [];
    treeData = await (level === 0
      ? getFirstGroupList({ parent_id: 0 })
      : getSecondGroupList({ parent_id: value }));
    treeData.list = treeData.list.map((item) => {
      return {
        ...item,
        leaf: !item.has_children,
      };
    });
    resolve(treeData.list);
  };
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      parent_id: [],
      major_name: '',
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
