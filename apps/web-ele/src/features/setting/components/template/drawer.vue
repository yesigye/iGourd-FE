<script setup lang="ts">
import { ref } from 'vue';

import {
  ElCheckbox,
  ElCol,
  ElRow,
  ElScrollbar,
  ElTree,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getPrintTemplateOptionList } from '@@/setting/apis';

import { PageTitle } from '#/components';

import { getTableTreeId } from './utils';

const printComponents = ref({
  PrintText: 'PrintText',
  PrintImage: 'PrintImage',
  PrintTitle: 'PrintTitle',
  PrintLabel: 'PrintLabel',
  PrintBarcode: 'PrintBarcode',
  PrintTable: 'PrintTable',
  PrintDivider: 'PrintDivider',
  PrintRichTextEditor: 'PrintRichText',
});
const templateType = ref('');
const [Drawer, drawerApi] = useIgourdDrawer({
  title: '添加打印模板',
  appendToMain: true,
  class: 'w-full',
  async onOpenChange(isOpen) {
    if (isOpen) {
      const type = drawerApi.getData().templateType;
      templateType.value = type;
      fetchTemplateColumnList();
    }
  },
  onClosed() {},
  async onConfirm() {},
});
const { t } = useI18n();
const isAllChecked = ref(false);
// 模板备选项
const data = ref([]);
const otherOption = ref([
  { id: `type-other`, name: 'other', children: [], isPenultimate: true },
]);
const printForm = ref({
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
      const titleValue = props.isNewTemplate
        ? item.default_value // 编辑模式：使用已保存的标题
        : props.currentTemplateData.title_name; // 新建模式：使用默认值

      // 更新全局标题名称
      titleName.value = titleValue;

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
      // const defaultValue = processAffixedValue(
      //   item.default_value, // 原始默认值
      //   item.prefix, // 前缀
      //   false, // 是否为后缀
      //   merchantInfo, // 商户信息，用于动态替换
      // );

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

    // // 如果不是新建模板（即编辑模式），需要回显已保存的数据
    // if (props.isNewTemplate) {
    //   // 新建模板的话，获取系统初始化模板，选中数据
    //   // TODO 因为tree组件获取默认值后会触发 check-change 事件，所以需要加一个标记来控制是否执行逻辑
    //   isAddNewTemplate.value = true;
    //   await getTemplateInit(apiData);
    //   isAddNewTemplate.value = false;
    // } else {
    //   await handleExistingTemplateData(apiData);
    // }

    // // 获取模板列表（可能是获取其他相关模板信息）
    // fetchTemplateList();
  } catch (error: any) {
    console.error('获取模板列表失败:', error);
  }
};
</script>

<template>
  <Drawer>
    <section class="h-full">
      <ElRow class="w-full">
        <ElCol :span="8">
          <PageTitle title="Default Template" />
          <p class="border-b border-t border-dashed border-[#99999999]">
            <ElCheckbox v-model="isAllChecked" label="Select All" />
          </p>
          <ElScrollbar>
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
                    {{ t(`printTemp.printReceipt.${node.data.name}`) }}</span>
                  <span v-else>{{ node.data.name }}</span>
                </div>
              </template>
            </ElTree>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="8"> <p class="text-center">模板预览</p> </ElCol>
        <ElCol :span="8"> <p class="text-center">模板配置项</p> </ElCol>
      </ElRow>
    </section>
  </Drawer>
</template>
