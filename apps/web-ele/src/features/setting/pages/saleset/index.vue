<template>
  <Page auto-content-height>
    <!-- 产品设置 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.productSettings') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="flex items-center justify-between py-3 border-b">
          <div>
            <div class="font-medium">{{ t('setting.useProductSpecification') }}</div>
            <div class="text-sm text-gray-500">{{ t('setting.productSpecificationPrompt') }}</div>
          </div>
          <Switch
            v-model:checked="productSettings.use_product_specification_settings"
            @change="handleProductSpecChange"
          />
        </div>
      </div>
    </div>

    <!-- 销售设置 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.salesSettings') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.prohibitedToSellIt') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.whenProhibitedToSellIt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_less_zero_prohibited"
              @change="(value) => handleSalesSwitchChange('is_less_zero_prohibited', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.temporaryChangePrice') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.temporaryChangePricePrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_price_modify_support"
              @change="(value) => handleSalesSwitchChange('is_price_modify_support', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.discountSupport') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.discountSupportPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_discount_support"
              @change="(value) => handleSalesSwitchChange('is_discount_support', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.couponSupport') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.couponSupportPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_coupon_support"
              @change="(value) => handleSalesSwitchChange('is_coupon_support', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.memberPriceSupport') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.memberPriceSupportPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_member_price_support"
              @change="(value) => handleSalesSwitchChange('is_member_price_support', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.bulkPriceSupport') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.bulkPriceSupportPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_bulk_price_support"
              @change="(value) => handleSalesSwitchChange('is_bulk_price_support', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3">
            <div>
              <div class="font-medium">{{ t('setting.promotionSupport') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.promotionSupportPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="salesSettings.is_promotion_support"
              @change="(value) => handleSalesSwitchChange('is_promotion_support', value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 收银设置 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.cashierSettings') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoPrintReceipt') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoPrintReceiptPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_print_receipt"
              @change="(value) => handleCashierSwitchChange('is_auto_print_receipt', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoPrintLabel') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoPrintLabelPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_print_label"
              @change="(value) => handleCashierSwitchChange('is_auto_print_label', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoCalculateTax') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoCalculateTaxPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_calculate_tax"
              @change="(value) => handleCashierSwitchChange('is_auto_calculate_tax', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoRoundAmount') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoRoundAmountPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_round_amount"
              @change="(value) => handleCashierSwitchChange('is_auto_round_amount', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoSaveCustomer') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoSaveCustomerPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_save_customer"
              @change="(value) => handleCashierSwitchChange('is_auto_save_customer', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3">
            <div>
              <div class="font-medium">{{ t('setting.autoSaveTransaction') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoSaveTransactionPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="cashierSettings.is_auto_save_transaction"
              @change="(value) => handleCashierSwitchChange('is_auto_save_transaction', value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 库存设置 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.inventorySettings') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoDeductInventory') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoDeductInventoryPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_deduct_inventory"
              @change="(value) => handleInventorySwitchChange('is_auto_deduct_inventory', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoUpdateCost') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoUpdateCostPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_update_cost"
              @change="(value) => handleInventorySwitchChange('is_auto_update_cost', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoUpdatePrice') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoUpdatePricePrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_update_price"
              @change="(value) => handleInventorySwitchChange('is_auto_update_price', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoUpdateSpec') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoUpdateSpecPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_update_spec"
              @change="(value) => handleInventorySwitchChange('is_auto_update_spec', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div>
              <div class="font-medium">{{ t('setting.autoUpdateCategory') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoUpdateCategoryPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_update_category"
              @change="(value) => handleInventorySwitchChange('is_auto_update_category', value)"
            />
          </div>
          
          <div class="flex items-center justify-between py-3">
            <div>
              <div class="font-medium">{{ t('setting.autoUpdateBrand') }}</div>
              <div class="text-sm text-gray-500">{{ t('setting.autoUpdateBrandPrompt') }}</div>
            </div>
            <Switch
              v-model:checked="inventorySettings.is_auto_update_brand"
              @change="(value) => handleInventorySwitchChange('is_auto_update_brand', value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 高级设置 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">{{ t('setting.advancedSettings') }}</h3>
        <ElButton type="primary" @click="handleAdd">
          {{ t('setting.addSetting') }}
        </ElButton>
      </div>
      
      <Grid>
        <template #operation="{ row }">
          <ElButton type="text" @click="handleDetail(row)">
            {{ t('common.detail') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleEditSaleset(row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'ACTIVE' ? t('setting.deactivate') : t('setting.activate') }}
          </ElButton>
          <ElButton 
            v-if="row.status !== 'ACTIVE'"
            type="text"
            @click="handleDelete(row)"
          >
            {{ t('common.delete') }}
          </ElButton>
        </template>
      </Grid>
    </div>
    
    <SalesetDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page, Switch } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSettingSaleset } from '@@/setting/hooks';

defineOptions({
  name: 'ISettingSaleset',
});

const { t } = useI18n();

const {
  Grid,
  SalesetDrawer,
  productSettings,
  salesSettings,
  cashierSettings,
  inventorySettings,
  handleAdd,
  handleEditSaleset,
  handleDetail,
  handleToggleStatus,
  handleDelete,
  handleProductSpecChange,
  handleSalesSwitchChange,
  handleCashierSwitchChange,
  handleInventorySwitchChange,
  refresh,
} = useSettingSaleset();
</script>
