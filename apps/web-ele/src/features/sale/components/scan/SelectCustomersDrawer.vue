<script setup>
import { inject, onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElDrawer,
  ElImage,
  ElInput,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { debounce } from '@igourd/utils';

import { storeToRefs } from 'pinia';

import { useCustomerStore } from '#/store/sale/customer';

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['close-tkr', 'select-customer-row:row']);
const { t } = useI18n();
const keywords = ref('');
const isReturnShow = ref(false);
const mergeGoodsList = inject('mergeGoodsList');

const customerStore = useCustomerStore();
const { customerList } = storeToRefs(customerStore);
const customerInfo = ref({});

const handleClose = () => {
  isReturnShow.value = false;
  emit('close-tkr');
};
const fetchGoodsList = debounce(async () => {
  await customerStore.getCustomerList({
    page_size: 100,
    keywords: keywords.value,
  });
}, 500);
const handleRowClick = (row) => {
  emit('select-customer-row:row', row);
  handleClose();
};
onMounted(() => {
  fetchGoodsList();
});
watch(
  () => props.showDialog,
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
      v-model="isReturnShow"
      :model-value="props.showDialog"
      :with-header="false"
      direction="rtl"
      size="86%"
      custom-class="coupon-drawer-prevent-send"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <!-- 列表关闭栏 -->
      <div class="close86" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="drawer-title">
        <p class="title">
          {{ props.title }}&nbsp;&nbsp;
          <!-- <i class="iconfont icon-bangzhu"></i> -->
        </p>
      </div>
      <div class="drawer-content">
        <div class="top">
          <ElInput
            v-model="keywords"
            style="height: 36px"
            :placeholder="$t('customers.search-placeholder')"
            clearable
            @clear="fetchGoodsList"
          />
          <ElButton
            class="outer-btn right-box search-btn blue-btn"
            @click="fetchGoodsList"
          >
            <div class="outer">
              <div class="inner-left">
                <i class="iconfont icon-sousuo"></i>
              </div>
              <div class="inner-right">
                <span> {{ $t('employee.searchButton') }}</span>
              </div>
            </div>
          </ElButton>
        </div>
        <div class="person">
          <ElTable
            :data="customerList || []"
            class="down-table-list"
            :show-header="false"
            :lazy="true"
            row-class-name="cursor-pointer"
            border
            stripe
            highlight-current-row
            @row-click="handleRowClick"
          >
            <!-- <el-table-column type="selection" align="center" :width="55"> </el-table-column> -->
            <ElTableColumn
              prop="profilePhoto"
              width="80"
              fixed="left"
              align="center"
            >
              <template #default="scope">
                <div class="profile-photo-box">
                  <ElImage
                    :src="scope.row.profile_photo"
                    alt=""
                    class="product-pic"
                    :preview-src-list="[scope.row.profile_photo]"
                    :initial-index="0"
                    :preview-teleported="true"
                  >
                    <!-- 当图片加载失败时，显示默认图片 -->
                    <template #error>
                      <img
                        src="#/assets/img/personDefault.png"
                        alt=""
                        class="product-pic"
                      />
                    </template>
                  </ElImage>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="name">
              <template #default="{ row }">
                <div class="name-box">
                  <span class="name">{{ row.name ? row.name : '-' }}</span>
                  <span class="phone">{{
                    row.phone_number ? row.phone_number : '-'
                  }}</span>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="balance"
              fixed="right"
              width="150"
              align="center"
            >
              <template #default="{ row }">
                <span><i
                    class="iconfont icon-31jifen"
                    style="margin-right: 5px"
                  ></i>{{ row.balance }}</span>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
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

  .top {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }

  .down-table-list {
    //width: 1123px;
    height: 511px;
  }
}

.person {
  margin-top: 34px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.drawer-title {
  font-size: 24px;
  font-weight: bold;
}

.profile-photo-box {
  img {
    width: 100%;
    height: 100%;
  }
}

.name-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  .name {
    font-size: 16px;
    font-weight: bold;
    color: #323232;
  }

  .phone {
    font-size: 14px;
    color: #323232;
  }
}
</style>
