<script setup>
import { ref } from 'vue';

import {
  ElButton,
  ElImage,
  ElInput,
  ElTable,
  ElTableColumn,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { guidePageListApi } from '@@/sale/apis';

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
const searchValue = ref('');
const customerList = ref([]);
async function getCustomerList() {
  const data = await guidePageListApi({
    page_size: 100,
    page_num: 1,
    keywords: searchValue.value,
  });
  if (data) {
    customerList.value = data.list;
  }
}

const handleClose = () => {
  isReturnShow.value = false;
};

const handleRowClick = (row) => {
  emit('select-customer-row:row', row);
  emit('close-tkr');
  drawerApi.close();
};
const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {
      getCustomerList();
    }
  },
});
</script>

<template>
  <Drawer>
    <div class="">
      <div class="">
        <div class="flex items-center gap-1">
          <ElInput
            v-model="searchValue"
            style="height: 36px"
            :placeholder="$t('scan.search-guider-placeholder')"
            clearable
            @clear="fetchGoodsList"
          />
          <ElButton
            class="outer-btn right-box search-btn blue-btn h-9"
            type="primary"
            @click="getCustomerList"
          >
            <div class="outer">
              <div class="inner-left">
                <i class="iconfont icon-sousuo"></i>
              </div>
              <div class="inner-right">
                <span> {{ $t('common.search') }}</span>
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
                        src="#/assets/sale/personDefault.png"
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
                  <span class="name text-gray-dark">{{
                    row.name ? row.name : '-'
                  }}</span>
                  <span class="phone text-gray-dark">{{
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
                <span
                  ><i class="iconfont icon-yonghu" style="margin-right: 5px"></i
                  >{{ row.balance }}</span
                >
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style lang="scss" scoped>
.drawer-title {
  height: 112px;
  padding-top: 37px;
  padding-left: 50px;
  text-align: left;

  .title {
    font-size: 24px;
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
  }

  .phone {
    font-size: 14px;
  }
}
</style>
