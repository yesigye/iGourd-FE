<script lang="ts" setup>
import { ref, watch } from 'vue';

import {
  useIgourdModal,
  ElRow,
  ElCol,
  ElIcon,
  ElButton,
  ElMessage,
  ElMessageBox,
  confirm,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import tableEmpty from '../../../../assets/setting/table-empty.svg';
import { Plus } from '@element-plus/icons-vue';
import { AddTag, AddTagValue } from '@@/setting/components/saleset';
import {
  getQuickTagsApi,
  removeQuickTagsApi,
  getQuickTagsValueApi,
  removeQuickTagsValueApi,
} from '@@/setting/apis/saleset';
const { t } = useI18n();
const list = ref<number[]>([]);

const addQuickTagVisible = ref(false);
const addQuickTagContEndVisible = ref(false);
const handCancel = () => {
  addQuickTagVisible.value = false;
};
// 使用 ref 保存本地状态
// 获取快捷标签列表
const quickTagsList = ref([]);
const getQuickTagsList = async () => {
  const result = await getQuickTagsApi({
    keywords: '',
  });
  quickTagsList.value = result;
};
// 打开添加快捷标签弹窗
const handleAddQuickTag = () => {
  addTagModalApi.setData({});
  addTagModalApi.open();
};

// 编辑标签
const handleEditQuickTag = (item) => {
  addTagModalApi.setData({ id: item.id,value: item.order_holding_tag_name });
  addTagModalApi.open();
};
const deleteQuickTag = async (item: { id: string }) => {
  confirm({
    title: t('common.confirm'),
    content: t('settings.quick_tag_del_tips'),
  }).then(async () => {
    const result = await removeQuickTagsApi({
      id: item.id,
    });
    getQuickTagsList();
  });
};

// 获取选中标签的标签值
const quickTagsValueList = ref([]);
// 选中标签的id
const quickTagsId = ref('');
const getQuickTagsValueList = async (id: string) => {
  quickTagsId.value = id;
  if (!quickTagsId.value) return;
  const result = await getQuickTagsValueApi({
    order_holding_tag_id: quickTagsId.value,
    page_num: '1',
    page_size: '1000',
  });
  quickTagsValueList.value = result.list;
};
// 添加标签值
const orderHoldingTagValueName = ref('');
const isEditModeValue = ref(false);
const QuickTagsValueId = ref('');
const addQuickTagsValue = async (type: string) => {
  let mode = isEditModeValue.value
    ? 'modifyQuickTagsValue'
    : 'createQuickTagsValue';
  const { code } = await Quick_Tags_Service[mode]({
    id: isEditModeValue.value ? QuickTagsValueId.value : '',
    order_holding_tag_id: quickTagsId.value,
    order_holding_tag_value: orderHoldingTagValueName.value,
  });
  if (code === 'SUCCESS') {
    if (type === 'saveAndAdd') {
      orderHoldingTagValueName.value = '';
      getQuickTagsValueList(quickTagsId.value);
    } else {
      orderHoldingTagValueName.value = '';
      addQuickTagContEndVisible.value = false;
      getQuickTagsValueList(quickTagsId.value);
    }
  }
};
// 打开添加标签值弹窗
const handleAddQuickTagContEnd = () => {
  if (!quickTagsId.value) {
    ElMessage.warning({
      message: t('settings.quick_tag_message'),
      customClass: 'message-box-warning',
    });
    return false;
  }
  addTagValueModalApi.setData({ tagId: quickTagsId.value });
  addTagValueModalApi.open();
};
// 编辑标签值
const handleEditQuickTagValue = (item) => {
  addTagValueModalApi.setData({
    tagId: quickTagsId.value,
    tagValueId: item.id,
    value: item.order_holding_tag_value,
  });
  addTagValueModalApi.open();
};
// 删除标签值
const handleDelQuickTagValue = async (item) => {
  const result = await removeQuickTagsValueApi({
    id: item.id,
  });
  getQuickTagsValueList(quickTagsId.value);
};
const [AddTagValueModal, addTagValueModalApi] = useIgourdModal({
  connectedComponent: AddTagValue,
  class: 'w-[50%]',
  draggable: true,
  modal: false,
});
const [AddTagModal, addTagModalApi] = useIgourdModal({
  connectedComponent: AddTag,
  class: 'w-[50%]',
  draggable: true,
  modal: false,
});
const [Modal, modalApi] = useIgourdModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      getQuickTagsList();
    }
  },
});
</script>
<template>
  <Modal :title="t('saleset.quick-tags')">
    <section class="min-h-[468px] text-xs">
      <el-row>
        <el-col :span="8">
          <div
            class="quick-tag-list bg-cloud-white border-gray-pale h-full border border-solid"
          >
            <div class="add-quick-tag-item">
              <span>{{ t('saleset.quick-tags') }}</span>
              <el-icon
                class="add-quick-tags-icon text-azure-bright"
                @click="handleAddQuickTag"
                ><Plus
              /></el-icon>
            </div>
            <div class="mt-2">
              <div
                v-for="(item, index) in quickTagsList"
                :key="index"
                class="quick-tag-item"
                :class="
                  quickTagsId == item.id
                    ? 'quick-tag-item-active bg-sky-mist text-azure'
                    : ''
                "
                @click="getQuickTagsValueList(item.id)"
              >
                <span>{{ item.order_holding_tag_name }}</span>
                <p class="flex gap-2 text-xs">
                  <el-button
                    link
                    type="primary"
                    @click.stop="handleEditQuickTag(item)"
                    >{{ t('common.edit') }}</el-button
                  >
                  <el-button
                    link
                    type="danger"
                    @click.stop="deleteQuickTag(item)"
                    >{{ t('common.delete') }}</el-button
                  >
                </p>
              </div>
              <div
                v-if="quickTagsList.length <= 0"
                class="mt-10 flex items-center justify-center"
              >
                <div class="text-center">
                  <img :src="tableEmpty" alt="" />
                  <p>{{ t('common.add_quick_tag_tips') }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="quick-tag-content">
            <div class="quick-tag-content-title">
              <span>{{ t('saleset.content') }}</span>
              <el-button
                type="primary"
                icon="Plus"
                @click="handleAddQuickTagContEnd"
              >
                {{ t('common.add') }}
              </el-button>
            </div>
            <div class="quick-tag-content-list mt-2">
              <el-scrollbar height="400px" class="">
                <div
                  v-for="item in quickTagsValueList"
                  :key="item.id"
                  class="quick-tag-content-item border-frost mb-2 flex justify-between border-b border-solid pb-2"
                >
                  <span>
                    {{ item.order_holding_tag_value }}
                  </span>
                  <p class="flex gap-2 text-xs">
                    <el-button
                      link
                      type="primary"
                      @click="handleEditQuickTagValue(item)"
                      >{{ t('common.edit') }}</el-button
                    >
                    <el-button
                      link
                      type="danger"
                      @click="handleDelQuickTagValue(item)"
                      >{{ t('common.delete') }}</el-button
                    >
                  </p>
                </div>
                <div
                  v-if="quickTagsValueList.length <= 0"
                  class="mt-10 flex items-center justify-center"
                >
                  <div class="text-center">
                    <img :src="tableEmpty" alt="" />
                    <p>{{ t('common.add_quick_tag_value_tips') }}</p>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>
    <AddTagModal @confirm="getQuickTagsList" />
    <AddTagValueModal @confirm="getQuickTagsValueList(quickTagsId)" />
  </Modal>
</template>
<style lang="scss" scoped>
.quick-tag-list {
  height: 100%;
  min-height: 468px;
  padding: 14px 0;
  font-size: 12px;

  .add-quick-tag-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 16px;
  }

  .quick-tag-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 34px;
    padding: 0 6px 0 60px;
    cursor: pointer;
  }
}

.quick-tag-content {
  padding: 10px;

  .quick-tag-content-title {
    display: flex;
    justify-content: space-between;
  }
}

.add-quick-tags-body {
  box-sizing: border-box;
  min-height: 70px;
  padding: 16px;
  padding-bottom: 0;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px;
  padding-top: 0;
}
</style>
