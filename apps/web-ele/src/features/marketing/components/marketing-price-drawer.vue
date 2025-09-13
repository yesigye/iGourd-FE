<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useI18n } from '@igourd/locales';
import { debounce } from '@igourd/utils';

import { createForm } from '@formily/core';
import {
  Form,
  FormButtonGroup,
  FormItem,
  Radio,
  Reset,
  Select,
  Submit,
} from '@formily/element-plus';
import { ElMessage } from 'element-plus';

import { inventoryApi } from '../../inventory/apis/inventory';

const props = defineProps<{
  formData: any;
  formSchema: any;
  title: string;
}>();
const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();
const { t } = useI18n();
const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');

// 表单实例
const form = createForm({
  values: props.formData,
  effects: () => {
    // 监听 change_mode 变化
    form.onFieldValueChange('change_mode', (field) => {
      if (field.value === 'AMOUNT') {
        form.setFieldValue('rounding_off', undefined);
        form.setFieldValue('rounding_amount', undefined);
      }
    });
  },
});

// 取整类型
const roundingOffList = ref([
  { id: 'HIGH', localKey: 'roundhigh' },
  { id: 'MIDDLE', localKey: 'roundmiddle' },
  { id: 'LOW', localKey: 'roundlow' },
]);

// 取整金额
const roundingAmountList = ref([0.001, 0.01, 0.1, 1, 10, 100, 1000]);

// 关联商品数据
const selectedGroups = ref([{ id: null }]);
const selectedLabels = ref([{ id: null }]);
const selectedProducts = ref([{ id: null, code: '', major_name: '' }]);

// 商品数据
const productData = ref([]);
const groupData = ref([]);
const labelData = ref([]);

// 获取表格数据
const getTableData = () => {
  switch (form.values.relation_type) {
    case 'PRODUCT': {
      return selectedProducts.value;
    }
    case 'PRODUCT_GROUP': {
      return selectedGroups.value;
    }
    case 'PRODUCT_LABEL': {
      return selectedLabels.value;
    }
    default: {
      return [{}];
    }
  }
};

// 添加项目
const addItem = () => {
  switch (form.values.relation_type) {
    case 'PRODUCT': {
      selectedProducts.value.push({ id: null, code: '', major_name: '' });
      break;
    }
    case 'PRODUCT_GROUP': {
      selectedGroups.value.push({ id: null });
      break;
    }
    case 'PRODUCT_LABEL': {
      selectedLabels.value.push({ id: null });
      break;
    }
  }
};

// 删除项目
const deleteItem = (index: number) => {
  switch (form.values.relation_type) {
    case 'PRODUCT': {
      if (index === 0) {
        selectedProducts.value[0] = { id: null, code: '', major_name: '' };
      } else {
        selectedProducts.value.splice(index, 1);
      }
      break;
    }
    case 'PRODUCT_GROUP': {
      if (index === 0) {
        selectedGroups.value[0] = { id: null };
      } else {
        selectedGroups.value.splice(index, 1);
      }
      break;
    }
    case 'PRODUCT_LABEL': {
      if (index === 0) {
        selectedLabels.value[0] = { id: null };
      } else {
        selectedLabels.value.splice(index, 1);
      }
      break;
    }
  }
};

// 商品选择变化
const handleProductChange = (val: any, row: any) => {
  switch (form.values.relation_type) {
    case 'PRODUCT': {
      const product = productData.value.find((item) => item.id === val);
      if (product) {
        const isAlreadySelected = selectedProducts.value.some(
          (item) => item !== row && item.id === val,
        );
        if (isAlreadySelected) {
          ElMessage.warning(t('marketing.thisProductHasBeenSelected'));
          row.id = null;
        } else {
          Object.assign(row, product);
        }
      }

      break;
    }
    case 'PRODUCT_GROUP': {
      const selectedGroup = groupData.value.find((group) => group.id === val);
      if (selectedGroup) {
        const isAlreadySelected = selectedGroups.value.some(
          (item) => item !== row && item.id === val,
        );
        if (isAlreadySelected) {
          ElMessage.warning(t('marketing.thisProductGroupHasBeenSelected'));
          row.id = null;
        } else {
          Object.assign(row, selectedGroup);
        }
      }

      break;
    }
    case 'PRODUCT_LABEL': {
      const selectedLabel = labelData.value.find((label) => label.id === val);
      if (selectedLabel) {
        const isAlreadySelected = selectedLabels.value.some(
          (item) => item !== row && item.id === val,
        );
        if (isAlreadySelected) {
          ElMessage.warning(t('marketing.thisProductLabelHasBeenSelected'));
          row.id = null;
        } else {
          Object.assign(row, selectedLabel);
        }
      }

      break;
    }
    // No default
  }
};

// 获取商品数据
const getProductData = async (keywords = '') => {
  try {
    const res = await inventoryApi.getProductList({
      merchant_id: userInfo?.current_login_user_app?.owner_id,
      page_num: 1,
      page_size: 15,
      keywords,
    });
    productData.value = res.data?.list || [];
  } catch (error) {
    console.error('获取商品数据失败:', error);
  }
};

// 获取商品组数据
const getGroupData = async (keywords = '') => {
  try {
    const res = await inventoryApi.getProductGroupList({
      merchant_id: userInfo?.current_login_user_app?.owner_id,
      page_num: 1,
      page_size: 15,
      keywords,
    });
    groupData.value = res.data?.list || [];
  } catch (error) {
    console.error('获取商品组数据失败:', error);
  }
};

// 获取商品标签数据
const getLabelData = async (keywords = '') => {
  try {
    const res = await inventoryApi.getProductLabelList({
      merchant_id: userInfo?.current_login_user_app?.owner_id,
      page_num: 1,
      page_size: 15,
      keywords,
    });
    labelData.value = res.data?.list || [];
  } catch (error) {
    console.error('获取商品标签数据失败:', error);
  }
};

// 搜索商品
const searchProduct = debounce((query: string) => {
  if (!query.trim() && productData.value.length > 0) return;
  getProductData(query);
}, 300);

// 搜索商品组
const searchGroup = debounce((query: string) => {
  if (!query.trim() && groupData.value.length > 0) return;
  getGroupData(query);
}, 300);

// 搜索商品标签
const searchLabel = debounce((query: string) => {
  if (!query.trim() && labelData.value.length > 0) return;
  getLabelData(query);
}, 300);

// 提交表单
const handleSubmit = (values: any) => {
  // 处理关联商品数据
  switch (values.relation_type) {
    case 'PRODUCT': {
      values.relation_product_id_list = selectedProducts.value
        .filter((product) => product.id)
        .map((product) => product.id);
      break;
    }
    case 'PRODUCT_GROUP': {
      values.relation_product_group_id_list = selectedGroups.value
        .filter((group) => group.id)
        .map((group) => group.id);
      break;
    }
    case 'PRODUCT_LABEL': {
      values.relation_product_label_id_list = selectedLabels.value
        .filter((label) => label.id)
        .map((label) => label.id);
      break;
    }
  }
  emit('submit', values);
};

// 关闭抽屉
const handleClose = () => {
  emit('close');
};

// 监听表单数据变化
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      form.setValues(newData);
      // 根据 relation_type 设置选中数据
      switch (newData.relation_type) {
        case 'PRODUCT': {
          selectedProducts.value =
            newData.relation_product_list &&
            newData.relation_product_list.length > 0
              ? [...newData.relation_product_list]
              : [{ id: null, code: '', major_name: '' }];
          break;
        }
        case 'PRODUCT_GROUP': {
          selectedGroups.value =
            newData.relation_product_group_list &&
            newData.relation_product_group_list.length > 0
              ? [...newData.relation_product_group_list]
              : [{ id: null }];
          break;
        }
        case 'PRODUCT_LABEL': {
          selectedLabels.value =
            newData.relation_product_label_list &&
            newData.relation_product_label_list.length > 0
              ? [...newData.relation_product_label_list]
              : [{ id: null }];
          break;
        }
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  // 初始化数据
  getProductData();
  getGroupData();
  getLabelData();
});
</script>

<template>
  <div class="marketing-price-drawer">
    <div class="drawer-header">
      <h3>{{ title }}</h3>
      <el-button type="text" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </el-button>
    </div>
    <div class="drawer-content">
      <div class="creator-info">
        {{ t('marketing.creator') }}:
        <span>{{ userInfo?.user_model?.name }}</span>
      </div>
      <Form :form="form" :schema="formSchema" @submit="handleSubmit">
        <template #rounding_off>
          <FormItem
            v-if="form.values.change_mode === 'PERCENTAGE'"
            :label="t('marketing.roundingOff')"
            required
          >
            <Select
              v-model="form.values.rounding_off"
              :placeholder="t('marketing.pleaseSelectRoundingOff')"
            >
              <Option
                v-for="item in roundingOffList"
                :key="item.id"
                :label="t(`marketing.${item.localKey}`)"
                :value="item.id"
              />
            </Select>
          </FormItem>
        </template>
        <template #rounding_amount>
          <FormItem
            v-if="form.values.change_mode === 'PERCENTAGE'"
            :label="t('marketing.roundingAmount')"
            required
          >
            <Select
              v-model="form.values.rounding_amount"
              :placeholder="t('marketing.pleaseSelectRoundingAmount')"
            >
              <Option
                v-for="item in roundingAmountList"
                :key="item"
                :label="item"
                :value="item"
              />
            </Select>
          </FormItem>
        </template>
        <template #relation_type>
          <FormItem :label="t('marketing.selectormode')">
            <Radio.Group v-model="form.values.relation_type">
              <Radio value="ALL">{{ t('marketing.allproduct') }}</Radio>
              <Radio value="PRODUCT_GROUP">
                {{ t('marketing.productgroup') }}
              </Radio>
              <Radio value="PRODUCT_LABEL">
                {{ t('marketing.productlabel') }}
              </Radio>
              <Radio value="PRODUCT">{{ t('marketing.productName') }}</Radio>
            </Radio.Group>
          </FormItem>
        </template>
        <template #relation_products>
          <div
            v-if="
              form.values.relation_type && form.values.relation_type !== 'ALL'
            "
            class="relation-products"
          >
            <el-collapse v-model="form.values.relation_type">
              <el-collapse-item
                :title="t(`marketing.${form.values.relation_type}`)"
                :name="form.values.relation_type"
              >
                <el-table
                  :data="getTableData()"
                  stripe
                  border
                  class="relation-table"
                >
                  <el-table-column
                    v-if="form.values.relation_type === 'PRODUCT_GROUP'"
                    :label="t('marketing.productGroup')"
                    prop="id"
                  >
                    <template #default="scope">
                      <el-select
                        v-model="scope.row.id"
                        filterable
                        clearable
                        :placeholder="t('marketing.pleaseSelectProductGroup')"
                        @change="handleProductChange(scope.row.id, scope.row)"
                      >
                        <el-option
                          v-for="item in groupData"
                          :key="item.id"
                          :label="item.major_name"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="form.values.relation_type === 'PRODUCT_LABEL'"
                    :label="t('marketing.productLabel')"
                    prop="id"
                  >
                    <template #default="scope">
                      <el-select
                        v-model="scope.row.id"
                        filterable
                        clearable
                        :placeholder="t('marketing.pleaseSelectProductLabel')"
                        @change="handleProductChange(scope.row.id, scope.row)"
                      >
                        <el-option
                          v-for="item in labelData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="form.values.relation_type === 'PRODUCT'"
                    :label="t('marketing.productCode')"
                    prop="id"
                  >
                    <template #default="scope">
                      <el-select
                        v-model="scope.row.id"
                        filterable
                        clearable
                        :placeholder="t('marketing.pleaseSelectProductCode')"
                        @change="handleProductChange(scope.row.id, scope.row)"
                      >
                        <el-option
                          v-for="item in productData"
                          :key="item.id"
                          :label="`${item.product_code}-${item.major_name}`"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="t('marketing.action')"
                    width="120"
                    align="center"
                  >
                    <template #default="scope">
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click="deleteItem(scope.$index)"
                      >
                        <i class="iconfont icon-shanchu2"></i>
                      </el-button>
                      <el-button
                        link
                        type="primary"
                        size="small"
                        @click="addItem"
                      >
                        <i class="iconfont icon-tianjia"></i>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
        <FormButtonGroup>
          <Submit>{{ t('common.save') }}</Submit>
          <Reset>{{ t('common.reset') }}</Reset>
        </FormButtonGroup>
      </Form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.marketing-price-drawer {
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;

    h3 {
      margin: 0;
      font-size: 24px;
    }
  }

  .drawer-content {
    padding: 20px;

    .creator-info {
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;

      span {
        color: #f00;
      }
    }

    .relation-products {
      margin: 20px 0;

      .relation-table {
        margin-top: 10px;
      }
    }
  }
}
</style>
