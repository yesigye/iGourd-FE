<script setup>
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ElButton,
  ElCol,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
} from '@igourd/common-ui';

const props = defineProps({
  printShow: {
    type: Boolean,
    default: false,
  },
  printTitle: {
    type: String,
    default: '这是默认标题',
  },
});
const emit = defineEmits(['close-tkr']);
const { t } = useI18n();
const isReturnShow = ref(false);
const handleClose = () => {
  isReturnShow.value = false;
  emit('close-tkr');
};
const form = reactive({});
/**
 * 打印单参数
 */
const rowCount = ref(7);
const colCount = ref(8);
const hanleRowcountr = (row, col) => {
  rowCount.value = row;
  colCount.value = col;
};
const hanleRowcountl = (row, col) => {
  rowCount.value = row;
  colCount.value = col;
};
watch(
  () => props.printShow,
  (val) => {
    if (val) {
      isReturnShow.value = true;
    }
  },
);
</script>

<template>
  <div class="coupon-send">
    <ElDrawer
      :model-value="props.printShow"
      v-model="isReturnShow"
      :with-header="false"
      direction="rtl"
      size="45%"
      custom-class="coupon-drawer-prevent-send"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <!-- 列表关闭栏 -->
      <div class="close45" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="drawer-title">
        <p class="title">
          {{ props.printTitle }}&nbsp;&nbsp;<i
            class="iconfont icon-bangzhu"
          ></i>
        </p>
      </div>
      <div class="drawer-content" style="margin-left: 74px">
        <ElForm @submit.native.prevent :model="form" label-width="auto">
          <ElFormItem label="Price Quantity:" required>
            <ElInput style="width: 220px" />
          </ElFormItem>
          <ElFormItem label="Price Quantity:" required>
            <ElButton>PC112452</ElButton>
            <ElButton>PC112452</ElButton>
            <ElButton>PC112452</ElButton>
          </ElFormItem>
          <ElFormItem label="Price Quantity:" required label-position="top">
            <div class="bar-code">
              <div class="bar-table">
                <ElRow
                  :gutter="6"
                  style="width: 100%"
                  v-for="(item, index) in rowCount"
                  :key="index"
                >
                  <ElCol
                    :span="colCount"
                    v-for="(itemc, index) in 24 / colCount"
                    :key="index"
                  >
                    <div class="grid-content-box">
                      <div class="grid-content"></div>
                      <div class="grid-desc">xxx</div>
                    </div>
                  </ElCol>
                </ElRow>
              </div>
              <div class="bar-btn">
                <ElButton @click="hanleRowcountl(7, 8)">3x8</ElButton>
                <ElButton @click="hanleRowcountr(7, 6)">4x10</ElButton>
              </div>
            </div>
          </ElFormItem>
        </ElForm>
      </div>
      <div class="btn-box">
        <ElButton class="cancel-btn" @click="handleClose">Cancel</ElButton>
        <ElButton class="save-btn">Save</ElButton>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
.bar-table {
  width: 213px;
  padding: 8px 2px 8px 8px;
  margin-right: 12px;
  border: 1px solid #dbe0eb;
  border-radius: 4px;
}

.drawer-title {
  height: 112px;
  padding-top: 37px;
  padding-left: 50px;
  text-align: left;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 24px;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }
}

.drawer-content {
  margin: 30px 38px 0;

  .down-table-list {
    //width: 1123px;
    height: 511px;
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.drawer-title {
  font-weight: bold;
}

.el-row {
  margin-bottom: 6px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content-box {
  width: 100%;

  .grid-content {
    width: 100%;
    height: 24px;
    background-color: #dbe0eb;
    border-radius: 4px;
  }

  .grid-desc {
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    color: #323232;
    text-align: center;
  }
}

.bar-code {
  display: flex;
  justify-content: start;
}
</style>
