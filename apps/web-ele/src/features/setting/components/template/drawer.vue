<script setup lang="ts">
import type { PrintTemplateColumnOption } from '@@/setting/types/template';
import type { TreeNode } from 'element-plus';

import { computed, ref } from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElTree,
  PrintBarcode,
  PrintDivider,
  PrintImage,
  PrintLabel,
  PrintRichText,
  PrintTable,
  PrintText,
  PrintTitle,
  useIgourdDrawer,
  vuedraggable,
} from '@igourd/common-ui';
import { Close } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import {
  addCustomTemplateApi,
  editCustomTemplateApi,
  printTemplateSystemApi,
} from '@@/sale/apis';
import { getPrintTemplateOptionList } from '@@/setting/apis';

import { PageTitle } from '#/components';
import {
  generateTableItemJson,
  getDividerJsonTemplate,
  getRichTextJsonTemplate,
  treeSelectChange,
} from '#/utils/template';

import {
  getTableTreeId,
  PrintTemplateType,
  processAffixedValue,
  StyleInt,
} from './utils';

const emit = defineEmits(['saved']);
const printComponents = ref({
  PrintText,
  PrintImage,
  PrintTitle,
  PrintLabel,
  PrintBarcode,
  PrintTable,
  PrintDivider,
  PrintRichTextEditor: PrintRichText,
});
const templateType = ref('');
const isNewTemplate = ref(true);
const isAddNewTemplate = ref(false);
const currentTemplateData = ref<any>({});
const titleName = ref('');
const imageUrl = ref('');
const templateName = ref('');
const defaultCheckedKeys = ref([]);
const { t } = useI18n();

const [Drawer, drawerApi] = useIgourdDrawer({
  title: t('template.add-template'),
  appendToMain: true,
  class: 'w-2/3',
  async onOpenChange(isOpen) {
    if (isOpen) {
      const event = drawerApi.getData();
      templateType.value = event.templateType;
      isNewTemplate.value = !event.currentTemplateData?.id;
      currentTemplateData.value = event.currentTemplateData || {};

      // 编辑模板处理模板名称与标题
      if (event.currentTemplateData?.id) {
        templateName.value = currentTemplateData.value?.name || '';
        titleName.value = currentTemplateData.value.title_name || '';
      }

      fetchTemplateColumnList();
    } else {
      handleReset();
    }
  },
  onClosed() {
    handleReset();
  },
  async onConfirm() {
    await handleSave();
  },
});
const isAllChecked = ref(false);
// 模板备选项
const data = ref([]);
const otherOption = ref([
  { id: `type-other`, name: 'other', children: [], isPenultimate: true },
]);
const printForm = ref<PrintTemplateColumnOption>({
  id: '',
  component_type: '',
  option: {},
  style: {},
});
const apiTreeData = ref([]);
const tableDefault = ref([]);
/**
 * 构建树形结构的辅助函数
 * @param {Array} apiData - 从API获取的原始数据
 * @returns {object} 包含构建好的树形数据和表格ID数组
 */
const buildTreeStructure = (apiData: any[]) => {
  // 新逻辑 如果limit_quantity==1 旧逻辑不变 否则
  /**
   * 不可重复的数据 备选项
   */
  const treeNotRepeatableData = apiData.filter(
    (item) => item.limit_quantity <= 1,
  );
  /**
   * 可重复的数据 备选项
   */
  const treeRepeatableData = apiData.filter((item) => item.limit_quantity > 1);
  // 使用Map按option_group_type分组存储数据
  const typeMap = new Map();
  // 存储所有表格类型字段的ID
  const tableNewIds: string[] = [];

  // 遍历API数据进行预处理和分组
  treeNotRepeatableData.forEach((item) => {
    // 为每个字段添加对应的组件配置
    item.com = printComponents.value[item.component_type];

    // 按option_group_type分组（如：基本信息、商品信息、其他信息等）
    if (!typeMap.has(item.option_group_type)) {
      typeMap.set(item.option_group_type, []);
    }

    // 如果是表格类型，单独记录其ID
    if (item.component_type === 'PrintTable') {
      tableNewIds.push(item.id);
    }

    // 将当前项添加到对应分组中
    typeMap.get(item.option_group_type).push(item);
  });

  // 添加到其他里面
  treeRepeatableData.forEach((item) => {
    item.com = printComponents.value[item.component_type];
    otherOption.value[0].children.push(item);
  });
  const createChildNode = (item: any) => {
    // 创建基础节点结构
    const baseNode = {
      ...item, // 继承原始数据的所有属性
      label: item.name, // 显示标签
      isPenultimate: false, // 标识这是最后一层节点
      name: item.name, // 节点名称
      style: StyleInt(item.component_type), // 根据组件类型设置样式
      value: '', // 初始值为空
    };

    // 特殊处理标题类型字段
    if (item.component_type === 'PrintTitle') {
      // 根据是否为新模板决定标题值来源
      const titleValue = isNewTemplate.value
        ? item.default_value // 编辑模式：使用已保存的标题
        : '结算模式'; // 新建模式：使用默认值

      // 更新全局标题名称

      return {
        ...baseNode,
        option: {
          title: item.name,
          value: titleValue,
        },
      };
    } else {
      // 处理其他类型字段的默认值
      // processAffixedValue函数用于处理前缀、后缀等格式化
      const defaultValue = processAffixedValue(
        item.default_value, // 原始默认值
        item.prefix, // 前缀
        false, // 是否为后缀
      );

      return {
        ...baseNode,
        option: {
          title: item.name,
          value: defaultValue,
        },
      };
    }
  };
  // 根据分组数据生成树形结构
  const treeData = [...typeMap.entries()].map(([type, items]) => {
    // 创建父节点（分组节点）
    const parentNode = {
      id: `type-${type}`, // 唯一标识
      label: type, // 显示名称
      children: [], // 子节点数组
      isPenultimate: true, // 标识这是倒数第二层节点
      name: type, // 节点名称
    };

    // 为每个分组下的字段创建子节点
    parentNode.children = items.map((item) => createChildNode(item));
    return parentNode;
  });

  return { treeData, tableNewIds };
};
/**
 * 构建打印数据的辅助函数
 * @param {Array} previewDataIds - 预览数据ID数组
 * @returns {object} 包含处理后的打印数据和表格模板
 */
const buildPrintData = (previewDataIds: any[]) => {
  let tableTemplate: any = null; // 存储找到的表格模板

  // 将预览数据转换为实际的打印数据格式
  const printDataResult = previewDataIds
    .map((apiCacheData, idx) => {
      // 处理分割线组件
      if (apiCacheData?.component_type === 'PrintDivider') {
        const divider = getDividerJsonTemplate(PrintDivider);
        return {
          ...divider,
          id: divider.id + idx.toString(), // 确保ID唯一
          style: {
            // 设置分割线样式，使用保存的样式或默认值
            border: apiCacheData?.style?.border || 'dashed',
            borderCount: apiCacheData?.style?.borderCount || 1,
          },
        };
      } else if (apiCacheData?.component_type === 'PrintRichTextEditor') {
        const richTextEditor = getRichTextJsonTemplate(PrintRichText);
        return {
          ...richTextEditor,
          id: richTextEditor.id + idx.toString(), // 确保ID唯一
          style: {
            ...richTextEditor.style,
            ...apiCacheData.style,
          },
          option: {
            value: apiCacheData.option.value,
          },
        };
      }

      // 如果没有ID，跳过该项
      if (!apiCacheData?.id) return null;

      // 在树形数据中查找对应的原始模板
      for (const dataItem of data.value) {
        // 跳过分割线类型的数据项
        if (dataItem.component_type === 'PrintDivider') {
          // 处理其他选项中的分割线组件
          const found = otherOption.value[0].children?.find(
            (child) => child.component_type === dataItem.component_type,
          );
          if (found) {
            return found;
          }
        } else {
          // 检查是否包含表格模板
          if (dataItem.children[0]?.component_type === 'PrintTable') {
            tableTemplate = dataItem.children[0];
          }

          // 在子节点中查找匹配的模板
          const findOriginTemplate = dataItem.children?.find(
            (child) => child.id === apiCacheData.id,
          );

          // 如果找到匹配的模板，合并数据
          if (findOriginTemplate) {
            return { ...findOriginTemplate, ...apiCacheData };
          }
        }
      }
      return null;
    })
    .filter(Boolean); // 过滤掉null值

  console.log(printDataResult, 'printDataResult1');
  return { printDataResult, tableTemplate };
};

const printData = ref([]);
const business_type = ref('');
/**
 * 通用模板数据处理方法
 * @param {Array} apiData - API返回的字段数据
 * @param {boolean} isNewTemplate - 是否为新建模板
 * @param {object} templateData - 模板数据（新建时为系统模板数据，编辑时为当前模板数据）
 */
const processTemplateData = async (
  apiData: any[],
  isNewTemplate: boolean,
  templateData?: any,
) => {
  try {
    let optionContent: any;
    let businessType: string;
    let profilePhoto: string;
    if (isNewTemplate) {
      // 新建模板：获取系统模板数据
      const data = await printTemplateSystemApi({
        business_type: templateType.value,
      });

      if (!data[0].option_content) {
        return;
      }

      optionContent = JSON.parse(data[0].option_content);
      businessType = templateType.value;
      profilePhoto = data[0].profile_photo;
    } else {
      // 编辑模板：使用当前模板数据
      if (!currentTemplateData.value.option_content) {
        return;
      }

      optionContent = JSON.parse(currentTemplateData.value.option_content);
      businessType = currentTemplateData.value.business_type;
      profilePhoto = currentTemplateData.value.profile_photo;
    }

    // 重置默认选中的字段
    defaultCheckedKeys.value = [];

    // 存储需要在预览区显示的数据
    const previewDataIds: Array<{
      component_type?: string;
      id: string;
      style?: Record<string, string>;
    }> = [];

    // 表格相关的变量
    let tableOptionCode: ColumnOptionCode[] = [];
    let tableIds: string[] = [];
    const tableDefaultValue: any[] = [];
    let tableIndex = 0;

    // 遍历已保存的选项内容，分类处理不同类型的组件
    optionContent.forEach((item: any, index: number) => {
      // 处理分割线组件
      if (item.component_type === 'PrintDivider') {
        previewDataIds.push(item);
      } else if (item.component_type === 'PrintRichTextEditor') {
        previewDataIds.push(item);
      }
      // 处理表格组件
      else if (item.column_option_code?.length > 0) {
        const isTable =
          apiData.find((apiItem) => apiItem.id === item.column_option_code[0])
            ?.component_type === 'PrintTable';

        if (isTable) {
          tableIndex = index;
          tableIds = [...item.column_option_code];

          const { tableOptionCode: codes, defaultData } = getTableTreeId(
            item.column_option_code,
            apiData,
          );
          tableDefaultValue.push(defaultData);
          if (codes.length > 0) {
            tableOptionCode = [...codes];
          }
        }
      }
      // 处理普通字段组件
      else if (item.id) {
        defaultCheckedKeys.value.push(item.id);
        previewDataIds.push(item);
      }
    });

    // 构建最终的打印数据
    const { printDataResult, tableTemplate } = buildPrintData(previewDataIds);
    console.log(tableIds, 'tableIds');
    // 处理表格模板的特殊逻辑
    defaultCheckedKeys.value.push(...tableIds);
    printData.value = printDataResult;
    // 如果存在表格模板，将其插入到正确的位置
    if (tableTemplate) {
      printData.value.splice(tableIndex, 0, {
        ...generateTableItemJson(tableOptionCode),
        option: {
          value: tableDefaultValue,
        },
        style: { ...tableTemplate.style },
      });
    }

    // 设置其他模板属性
    business_type.value = businessType;

    // 处理图片组件（仅新建模板需要）
    printData.value.forEach((item) => {
      if (item.component_type === 'PrintImage') {
        item.option.value = profilePhoto;
      }
    });

    // 设置图片URL
    if (profilePhoto) {
      imageUrl.value = [
        {
          fileUrl: profilePhoto,
          fileType: 'image/jpeg',
        },
      ];
    }
  } catch (error) {
    console.error('处理模板数据失败:', error);
  }
};
/**
 * 初始化系统模板
 * @param {Array} apiData - API返回的字段数据
 */
const getTemplateInit = async (apiData: any[]) => {
  await processTemplateData(apiData, true);
};
/**
 * 处理已有模板数据的回显逻辑
 * @param {Array} apiData - API返回的字段数据
 */
const handleExistingTemplateData = async (apiData: any[]) => {
  console.log(apiData, 'apiData');
  await processTemplateData(apiData, false);
};
const specList = ref<any[]>([]);
const specValue = ref('');
// 获取规格数据
const fetchTemplateList = async () => {
  try {
    const res = await getPrintTemplateOptionList({
      template_type: templateType.value,
      type: 'SPEC',
    });
    // if (res.code === 'SUCCESS') {
    specList.value = res;
    if (res.length > 0) {
      specValue.value = isNewTemplate.value
        ? res[0].id
        : specList.value.find(
            (item) => item.name === currentTemplateData.value.spec_option_name,
          )?.id || '';
    }
    // }
  } catch (error) {
    console.error(error);
  }
};
/**
 * 获取模板列字段数据并构建树形结构
 * 主要功能：
 * 1. 从API获取模板选项列表
 * 2. 构建左侧字段的树形结构
 * 3. 处理表格类型的特殊数据
 * 4. 如果是编辑模式，回显已保存的模板数据
 */
const fetchTemplateColumnList = async () => {
  try {
    // 调用API获取指定模板类型的列选项数据
    const apiData = await getPrintTemplateOptionList({
      template_type: templateType.value, // 模板类型（如：销售单、采购单等）
      type: 'COLUMN', // 固定值，表示获取列字段数据
    });

    // 缓存原始API数据，供其他地方使用
    apiTreeData.value = apiData;
    // // 如果没有数据，直接返回
    if (!apiData?.length) {
      return;
    }

    // // 构建树形结构和处理表格数据
    const { treeData, tableNewIds } = buildTreeStructure(apiData);

    // // 如果存在表格类型的字段，处理表格的默认数据
    if (tableNewIds.length > 0) {
      const { defaultData } = getTableTreeId(tableNewIds, apiData);
      tableDefault.value.push(defaultData);
    }

    // // 更新左侧树形结构数据
    data.value = [...treeData];
    if (isNewTemplate.value) {
      // 新建模板的话，获取系统初始化模板，选中数据
      // TODO 因为tree组件获取默认值后会触发 check-change 事件，所以需要加一个标记来控制是否执行逻辑
      isAddNewTemplate.value = true;
      await getTemplateInit(apiData);
      isAddNewTemplate.value = false;
    } else {
      // 如果不是新建模板（即编辑模式），需要回显已保存的数据
      await handleExistingTemplateData(apiData);
    }

    // 获取模板列表（可能是获取其他相关模板信息）
    fetchTemplateList();
  } catch (error: any) {
    console.error('获取模板列表失败:', error);
  }
};

const handleCheckChange = (node: TreeNode) => {
  console.log(node, 'node');
  console.log(
    !node.isPenultimate && !isAddNewTemplate.value,
    '!node.isPenultimate && !isAddNewTemplate.value',
  );
  if (!node.isPenultimate && !isAddNewTemplate.value) {
    console.log(node, 'node');
    treeSelectChange(printData, node, tableDefault.value);
  }
};
/**
 * 编辑字段详细配置
 */
const handleClick = (event: PrintTemplateColumnOption) => {
  printForm.value = event;
  if (!printForm.value.style) {
    printForm.value.style = {};
  }
};
const deaultOption = () => {
  printForm.value = {
    id: '',
    component_type: '',
    option: {},
    style: {},
  };
};
const handleReset = () => {
  // 清空打印数据
  printData.value = [];
  otherOption.value = [
    { id: `type-other`, name: 'other', children: [], isPenultimate: true },
  ];

  // 重置表单数据
  deaultOption(); // 调用已有的默认选项重置函数

  // 重置模板相关数据
  templateName.value = '';
  titleName.value = '';

  // 重置树形选择
  defaultCheckedKeys.value = [];

  // 重置表格默认数据
  tableDefault.value = [];

  // 清空API数据缓存
  apiTreeData.value = [];
};
const handleSave = async () => {
  const parms = [];
  printData.value.forEach((item) => {
    const JsonData: PrintTemplateApiType = {
      id: '',
      style: {
        textAlign: '',
      },
    };
    if (item.component_type === 'PrintImage') {
      JsonData.imageUrl = '';
    }
    for (const key in JsonData) {
      JsonData[key] = item[key];
    }
    if (item.component_type === 'PrintTable') {
      JsonData.column_option_code = item.column_option_code.map(
        (item) => item.id,
      );
    }
    if (item.component_type === 'PrintDivider') {
      JsonData.component_type = 'PrintDivider';
    } else if (item.component_type === 'PrintRichTextEditor') {
      JsonData.component_type = 'PrintRichTextEditor';
      JsonData.option = {
        value: item.option.value,
      };
    }
    parms.push(JsonData);
  });

  if (templateName.value) {
    const parmsData = {
      id: currentTemplateData.value.id || '',
      title_name: templateName.value,
      name: templateName.value,
      business_type: templateType.value,
      type: showLabelOrTicket.value,
      column_option_code_list: [],
      profile_photo: imageUrl.value[0]?.fileUrl || '',
      print_template_option_id: specValue.value,
      option_content: JSON.stringify(parms),
    };
    await (isNewTemplate.value
      ? addCustomTemplateApi(parmsData)
      : editCustomTemplateApi(parmsData));
  } else {
    ElMessage.warning('请输入模板名称');
    return false;
  }

  // if (res?.code === 'SUCCESS') {
  emit('saved', templateType.value, 'add');
  drawerApi.close();
  // }
};
// 判断显示标签还是票据
const showLabelOrTicket = computed(() => {
  const label = [PrintTemplateType.BARCODE_LABEL, PrintTemplateType.PRICE_TAG];
  const receipt = [
    PrintTemplateType.RECEIPT,
    PrintTemplateType.REFUND_RECEIPT,
    PrintTemplateType.DEBT_ORDER_RECEIPT,
    PrintTemplateType.CREDIT_ORDER_RECEIPT,
    PrintTemplateType.REPAYMENT_RECEIPT,
    PrintTemplateType.PRELIMINARY_BILL_RECEIPT,
  ];
  if (label.includes(templateType.value)) {
    return 'LABEL';
  } else if (receipt.includes(templateType.value)) {
    return 'RECEIPT';
  }
  return null;
});
// 删除分割线
const handDelDivider = () => {
  printData.value = printData.value.filter(
    (item) => item.id !== printForm.value.id,
  );

  printForm.value = {
    option: {},
    style: {},
  };
};
</script>

<template>
  <Drawer>
    <section class="h-full">
      <ElRow class="h-full w-full overflow-hidden">
        <ElCol :span="8" class="h-full overflow-hidden">
          <PageTitle
            :title="
              isNewTemplate
                ? t('template.add-template')
                : t('template.edit-template')
            "
          />
          <p class="border-b border-t border-dashed border-[#99999999]">
            <ElCheckbox
              v-model="isAllChecked"
              :indeterminate="isIndeterminate"
              :label="t('template.select-all')"
            />
          </p>
          <ElScrollbar class="h-[90%]">
            <ElTree
              :data="data"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :default-checked-keys="defaultCheckedKeys"
              @check-change="handleCheckChange"
            >
              <template #default="{ node }">
                <div class="custom-tree-node">
                  <span>{{ node.data.name }}</span>
                </div>
              </template>
            </ElTree>
            <ElTree
              v-if="otherOption[0]?.children?.length > 0"
              :data="otherOption"
              node-key="id"
              default-expand-all
              @node-click="handleCheckOther"
            >
              <template #default="{ node }">
                <div class="custom-tree-node">
                  <span v-if="node.data.id === 'type-other'">
                    {{ t(`template.${node.data.name}`) }}</span>
                  <span v-else>{{ node.data.name }}</span>
                </div>
              </template>
            </ElTree>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="8" class="h-full">
          <ElScrollbar>
            <section class="scrollbar-container scrollbar-container-center p-4">
              <!-- 中间预览区域 -->
              <!-- 小票区域 -->
              <div
                v-if="showLabelOrTicket === 'RECEIPT'"
                class="template-preview add-bill-template-drawer-body-box flex bg-white"
              >
                <vuedraggable
                  :key="titleName"
                  :list="printData"
                  :animation="100"
                  item-key="id"
                  :force-fallback="true"
                  ghost-class="ghost"
                  chosen-class="chosenClass"
                  class="w-full"
                >
                  <template #item="{ element }">
                    <div class="draggable-item select-none bg-white" style="">
                      <div v-if="element.com">
                        <component
                          :is="element.com"
                          :key="titleName"
                          :title="element.name"
                          :value="
                            element.component_type == 'PrintTitle'
                              ? titleName
                              : element.option.value
                          "
                          :item-style="element.style"
                          :element-data="element"
                          @click="handleClick(element)"
                        />
                      </div>
                      <div v-else>
                        <span class="text-gray-neutral">
                          {{ t('template.empty') }}</span>
                      </div>
                    </div>
                  </template>
                </vuedraggable>
              </div>
              <!-- 标签区域 -->
              <div
                v-if="showLabelOrTicket == 'LABEL'"
                class="add-bill-template-drawer-label-body-box flex bg-white"
              >
                <div class="template-preview-label flex">
                  <vuedraggable
                    :key="titleName"
                    :list="printData"
                    :animation="100"
                    item-key="id"
                    :force-fallback="true"
                    ghost-class="ghost"
                    chosen-class="chosenClass"
                    vuedraggable=".draggable-item"
                    class="w-full"
                  >
                    <template #item="{ element }">
                      <div
                        class="draggable-item bg-white"
                        @click="handleClick(element)"
                      >
                        <div v-if="element.com">
                          <component
                            :is="element.com"
                            :key="titleName"
                            :title="element.name"
                            :value="
                              element.component_type == 'PrintTitle'
                                ? titleName
                                : element.option.value
                            "
                            :item-style="element.style"
                            :element-data="element"
                            width="auto"
                            :style="{
                              width: '100%',
                            }"
                          />
                        </div>
                        <div v-else>
                          <span class="text-textColor-tertiary"
                            >组件未定义</span
                          >
                        </div>
                      </div>
                    </template>
                  </vuedraggable>
                </div>
              </div>
            </section>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="8" class="h-full overflow-auto">
          <ElScrollbar class="scrollbar-container">
            <!-- RIGHT setting col -->
            <div
              class="template-configuration add-bill-template-drawer-body-box bg-white"
            >
              <PageTitle :title="t('template.settings')">
                <template #rightOption>
                  <Close @click="deaultOption" />
                </template>
              </PageTitle>
              <ElForm
                :model="printForm"
                label-width="100px"
                style="max-width: 600px"
              >
                <!-- 模板主体配置 -->
                <div
                  v-if="
                    !printForm.id && printForm.component_type !== 'PrintTable'
                  "
                >
                  <ElFormItem :label="`${t('template.name')}:`">
                    <ElInput
                      v-model="templateName"
                      :placeholder="t('template.name-tips')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="`${t('template.spec')}:`">
                    <ElSelect v-model="specValue">
                      <el-option
                        v-for="item in specList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </ElSelect>
                  </ElFormItem>
                </div>
                <!-- 备选项配置 -->
                <div
                  v-if="
                    printForm.id || printForm.component_type === 'PrintTable'
                  "
                >
                  <ElFormItem
                    v-if="printForm.component_type === 'PrintTitle'"
                    :label="`${t('template.title-name')}:`"
                  >
                    <ElInput
                      v-model="titleName"
                      placeholder="Please enter the Title name"
                    />
                  </ElFormItem>

                  <ElFormItem
                    v-if="printForm.component_type !== 'PrintRichTextEditor'"
                    :label="`${t('template.position')}:`"
                  >
                    <ElRadioGroup
                      v-model="printForm.style.textAlign"
                      size="small"
                    >
                      <ElRadioButton value="left">
                        <div class="fontSize-box">
                          <i class="iconfont icon-juzhongduiqi"></i>
                        </div>
                      </ElRadioButton>
                      <ElRadioButton value="center">
                        <div class="fontSize-box">
                          <i class="iconfont icon-juzhong"></i>
                        </div>
                      </ElRadioButton>
                      <ElRadioButton value="right">
                        <div class="fontSize-box">
                          <i class="iconfont icon-youduiqi"></i>
                        </div>
                      </ElRadioButton>
                    </ElRadioGroup>
                  </ElFormItem>
                  <ElFormItem
                    v-if="printForm.component_type === 'PrintImage'"
                    :label="`${t('template.image')}:`"
                  >
                    <UploadComponent
                      v-model="imageUrl"
                      :max-size="1"
                      :api="fileUpload"
                      :show-tips="true"
                      @success="handleUploadSuccess"
                    />
                  </ElFormItem>
                  <!-- 边框类型 none:无 soild:实线 dashed:虚线 -->
                  <ElFormItem
                    v-if="
                      printForm.component_type === 'PrintDivider' ||
                      printForm.component_type === 'PrintTable'
                    "
                    :label="`${t('template.line-style')}:`"
                  >
                    <ElRadioGroup v-model="printForm.style.border">
                      <ElRadio value="none">
                        {{ t('template.empty') }}
                      </ElRadio>
                      <ElRadio value="solid">
                        {{ t('template.solid-line') }}
                      </ElRadio>
                      <ElRadio value="dashed">
                        {{ t('template.dotted-line') }}
                      </ElRadio>
                    </ElRadioGroup>
                  </ElFormItem>
                  <div v-if="printForm.component_type === 'PrintDivider'">
                    <!-- 边框条数  -->
                    <ElFormItem :label="`${t('template.line_type')}:`">
                      <ElRadioGroup v-model="printForm.style.borderCount">
                        <ElRadio :value="1">
                          {{ t('template.single-line') }}
                        </ElRadio>
                        <ElRadio :value="2">
                          {{ t('template.double-line') }}
                        </ElRadio>
                      </ElRadioGroup>
                    </ElFormItem>
                    <!-- 是否删除边框线 -->
                    <ElFormItem :label="`${t('template.action')}:`">
                      <ElButton type="warning" @click="handDelDivider">
                        {{ t('common.delete') }}
                      </ElButton>
                    </ElFormItem>
                  </div>
                  <!-- 富文本配置 -->
                  <div
                    v-if="printForm.component_type === 'PrintRichTextEditor'"
                  >
                    <RichTextEditor
                      :key="printForm.id"
                      v-model="printForm.option.value"
                      :height="200"
                      :width="400"
                    />
                    <div class="mt-5">
                      <ElFormItem
                        label-width="auto"
                        :label="`${t('template.action')}:`"
                      >
                        <ElButton type="warning" @click="handRichText">
                          {{ t('common.delete-btn') }}
                        </ElButton>
                      </ElFormItem>
                    </div>
                  </div>
                </div>
              </ElForm>
            </div>
          </ElScrollbar>
        </ElCol>
      </ElRow>
    </section>
  </Drawer>
</template>
