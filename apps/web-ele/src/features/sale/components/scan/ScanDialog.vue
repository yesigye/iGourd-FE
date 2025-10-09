<script setup lang="ts">
import { ref, watch } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { orderSuspendApi, quickTagsAllApi } from '@@/sale/apis';

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'update:Suspend']);
const { t } = useI18n();
const isShowDialog = ref(false);
const params = ref({
  remark: '',
  customer_id: null,
  device_id: null,
  merchant_id: null,
  order_holding: {
    order_holding_item_list: [
      {
        product_code: '',
        quantity: null,
        product_id: null,
        product_name: '',
        product_unit_id: null,
        product_unit_name: '',
      },
    ],
  },
  device_code: null,
  pos_user_id: null,
  total_amount: null,
});

interface Props {
  visible: boolean;
  goodsList: any;
  customerInfo: any;
  guiderInfo: object;
}
const handleClose = () => {
  isShowDialog.value = false;
  params.value.remark = '';
  activeTag.value = [];
  emit('update:visible', false);
};
const quickTagsList = ref([]);
const getQuickTagAll = async () => {
  const data = await quickTagsAllApi({});
  if (data) {
    // quickTagsList.value = res.data;
    quickTagsList.value = [];
    data.forEach((item) => {
      // 根据order_holding_tag_id分组
      const tagsIndex = quickTagsList.value.findIndex(
        (tagsItem) => tagsItem.id === item.order_holding_tag_id,
      );
      if (tagsIndex === -1) {
        const obj = {
          id: item.order_holding_tag_id,
          name: item.order_holding_tag_name,
          list: [item],
        };
        quickTagsList.value.push(obj);
      } else {
        quickTagsList.value[tagsIndex].list.push(item);
      }
    });
  }
};
const activeTag = ref([]);
// 是否选中

const ischecked = (id) => {
  return activeTag.value.includes(id);
};
// 选择标签
const handleTagClick = (item, tagItem) => {
  // 判断是否包含tagItem.id
  if (activeTag.value.includes(tagItem.id)) {
    // 删除 tagItem.id
    activeTag.value = activeTag.value.filter((id) => id !== tagItem.id);
    // 删除 remark
    params.value.remark = params.value.remark.replace(
      `  ${item.name}:${tagItem.order_holding_tag_value}`,
      '',
    );
  } else {
    activeTag.value.push(tagItem.id);
    const remark = `  ${item.name}:${tagItem.order_holding_tag_value}`;
    // 判断 formData.value.remark 中是否包含 remark,
    params.value.remark += remark;
  }
};
/**
 * @title 确定挂单
 * @description 挂单
 */
const handleSave = async () => {
  const order_holding_item_list = props.goodsList.map((item) => {
    return {
      product_code: item.code,
      quantity: item.calcInfo.quantity,
      product_id: item.id,
      product_name: item.major_name,
      product_unit_id: item.product_unit_id,
      product_unit_name: item.product_unit_name,
      product_profile_photo: item.profile_photo,
      cost_price: item.cost_price,
      selling_price: item.selling_price,
    };
  });
  params.value.customer_id = props?.customerInfo?.id ?? null; // 客户id
  params.value.guider_id = props.guiderInfo?.user_id ?? null; // 客户id

  params.value.order_holding = [
    {
      guider_id: props.guiderInfo?.user_id,
      order_holding_item_list,
    },
  ];
  params.value.total_amount = props.goodsList.reduce((acc, cur) => {
    return acc + cur.selling_price * cur.quantity;
  }, 0);
  try {
    const res = await orderSuspendApi(params.value);
    // 挂单成功
    ElMessage.success(t('scan.suspend-success'));
    isShowDialog.value = false;
    activeTag.value = [];

    emit('update:Suspend', true);
    handleClose();
  } catch (error: any) {
    ElMessage.error(error);
  }
};
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      console.log('newVal', newVal);
      isShowDialog.value = true;
      getQuickTagAll();
    }
  },
);
</script>

<template>
  <div class="scan-dialog">
    <ElDialog
      v-model="isShowDialog"
      width="799"
      align-center
      :before-close="handleClose"
    >
      <template #header>
        <h1 class="scan-dialog-title">{{ t('scan.remark') }}</h1>
      </template>
      <div class="scan-dialog-content">
        <ElInput
          v-model="params.remark"
          type="textarea"
          :maxlength="256"
          show-word-limit
          placeholder="Please enter remark"
        />
        <ElForm>
          <ElFormItem
            v-for="item in quickTagsList"
            :key="item.id"
            :label="`${item.name}:`"
          >
            <div class="tag-box">
              <div
                v-for="tagItem in item.list"
                :key="tagItem.id"
                class="tag-box-item border-skyblue-light text-blue-primary cursor-pointer border border-solid"
                :class="
                  ischecked(tagItem.id)
                    ? 'tag-box-item-active bg-skyblue-light'
                    : ''
                "
                @click="handleTagClick(item, tagItem)"
              >
                {{ tagItem.order_holding_tag_value }}
              </div>
            </div>
          </ElFormItem>
        </ElForm>
      </div>
      <div class="scan-dialog-btn">
        <ElButton class="btn-common bg-gray-pale" @click="handleClose">
          {{ t('set.cancel') }}
        </ElButton>
        <ElButton class="btn-common bg-azure text-white" @click="handleSave">
          {{ t('set.confirm') }}
        </ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss">
.scan-dialog {
  .el-dialog.is-align-center {
    // height: 500px !important;
  }

  .el-dialog {
    border-top: 5px solid #bef0f3;
  }

  .icon-tuxingyanzhengwancheng {
    font-size: 50px;
    color: #2bd002;
  }
}
</style>

<style lang="scss" scoped>
// 餐饮相关样式
.tag-box {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  .tag-box-item {
    display: flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 4px;
    // line-height: 20px;
    &:hover {
      background: #9fceff;
    }
  }
}

.scan-dialog-title {
  height: 111px;
  font-size: 24px;
  font-weight: 600;
  line-height: 111px;
  text-align: center;
}

.scan-dialog-content {
  padding-top: 20px;
  padding-left: 140px;

  :deep(.el-textarea__inner) {
    width: 500px;
    height: 200px;
  }
}

.scan-dialog-btn {
  padding-top: 20px;
  padding-left: 40px;
  text-align: center;
}

.btn-common {
  width: 160px;
  height: 50px;
}
</style>
