<script setup lang="ts">
import { ref } from 'vue';

import { ElCheckbox, ElCol, ElRow, ElScrollbar } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useAddTemplateDrawer } from '@@/setting/hooks';

import { PageTitle } from '#/components';

const { Drawer } = useAddTemplateDrawer();
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
            <el-tree
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
            </el-tree>
            <el-tree
              v-if="otherOption[0]?.children?.length > 0"
              :data="otherOption"
              node-key="id"
              default-expand-all
              @node-click="handleCheckOther"
            >
              <template #default="{ node }">
                <div class="custom-tree-node">
                  <span v-if="node.data.id === 'type-other'">
                    {{ t(`printTemp.printReceipt.${node.data.name}`) }}</span
                  >
                  <span v-else>{{ node.data.name }}</span>
                </div>
              </template>
            </el-tree>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="8"> <p class="text-center">模板预览</p> </ElCol>
        <ElCol :span="8"> <p class="text-center">模板配置项</p> </ElCol>
      </ElRow>
    </section>
  </Drawer>
</template>
