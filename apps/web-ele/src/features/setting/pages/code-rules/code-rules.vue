<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { ColPage, ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { codingTreeList } from '../../apis/rules';
import settingCodeRulesScene from '../../components/setting-code-rules-scene.vue';
import { useSettingCodeRulesList } from '../../hooks/use-setting-code-rules-list';

const { t } = useI18n();
const radio = ref('PURCHASE');

const {
  Grid,
  Drawer,
  drawerApi,
  gridApi,
  handleEdit,
  handleView,
  canBatchDelete,
  batchDelete,
} = useSettingCodeRulesList(radio);
const codingTreeListData = ref([]);
const getCodingTreeList = async () => {
  const res = await codingTreeList({
    page_num: 1,
    page_size: 100,
  });
  codingTreeListData.value = res.list;
  radio.value = res.list[0].tree_type;
  gridApi.reload();
};
const handChange = (val: string) => {
  radio.value = val;
  gridApi.reload();
};
onMounted(() => {
  getCodingTreeList();
});
</script>
<template>
  <!-- 只要里面一加其他元素 高度就会一直增加-->
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <settingCodeRulesScene
        :tree="codingTreeListData"
        :default-value="radio"
        @change="handChange"
      />

      <div v-if="isCollapsed" @click="expand">
        <Tooltip title="点击展开左侧">
          <Button shape="circle" type="primary">
            <IconifyIcon class="text-2xl" icon="bi:arrow-right" />
          </Button>
        </Tooltip>
      </div>
    </template>

    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
      </template>
    </Grid>
  </ColPage>
  <Drawer />
</template>
