<script setup>
import { ref } from 'vue';

import {
  ElButton,
  ElImage,
  ElInput,
  ElPagination,
  ElTable,
  ElTableColumn,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { debounce } from '@igourd/utils';

import { storeToRefs } from 'pinia';

import { useCustomerStore } from '#/store/sale/customer';

defineOptions({
  name: 'SelectCustomersDrawer',
});
const emit = defineEmits(['close-tkr', 'select-customer-row:row']);
const keywords = ref('');
const customerStore = useCustomerStore();
const { customerList, total } = storeToRefs(customerStore);

const fetchGoodsList = debounce(async () => {
  await customerStore.getCustomerList({
    page_size: 100,
    keywords: keywords.value,
  });
}, 500);
const handleRowClick = (row) => {
  emit('select-customer-row:row', row);
  drawerApi.close();
  emit('close-tkr');
};

const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {
      fetchGoodsList();
    }
  },
});
</script>

<template>
  <Drawer>
    <section class="h-full">
      <div class="flex h-full flex-col gap-2.5">
        <div class="flex flex-shrink-0 gap-1">
          <ElInput
            v-model="keywords"
            style="height: 36px"
            :placeholder="$t('scan.search-placeholder')"
            clearable
            @clear="fetchGoodsList"
          />
          <ElButton
            class="outer-btn right-box search-btn blue-btn h-9"
            type="primary"
            @click="fetchGoodsList"
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
        <div class="bg-card flex-grow">
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
                <span
                  ><i
                    class="iconfont icon-31jifen"
                    style="margin-right: 5px"
                  ></i
                  >{{ row.balance }}</span
                >
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <div class="flex-shrink-0">
          <ElPagination
            :small="true"
            v-model:current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            v-model:page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </section>
  </Drawer>
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
