<template>
  <div class="store-create">
    <el-steps :active="currentStep" :align-center="true" class="steps">
      <el-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.title"
        :description="step.description"
      />
    </el-steps>

    <div class="step-content">
      <!-- 步骤1: 基本信息 -->
      <div v-if="currentStep === 0" class="step-form">
        <h3>{{ t('store.basicInfo') }}</h3>
        <el-form :model="formData" label-width="120px">
          <el-form-item :label="t('store.storeName')" required>
            <el-input
              v-model="formData.storeName"
              :placeholder="t('store.pleaseInputStoreName')"
            />
          </el-form-item>
          <el-form-item :label="t('store.storeType')" required>
            <el-select
              v-model="formData.storeType"
              :placeholder="t('store.pleaseSelectStoreType')"
            >
              <el-option
                v-for="type in storeTypes"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('store.contactName')" required>
            <el-input
              v-model="formData.contactName"
              :placeholder="t('store.pleaseInputContactName')"
            />
          </el-form-item>
          <el-form-item :label="t('store.contactPhone')" required>
            <el-input
              v-model="formData.contactPhone"
              :placeholder="t('store.pleaseInputContactPhone')"
            />
          </el-form-item>
          <el-form-item :label="t('store.contactEmail')">
            <el-input
              v-model="formData.contactEmail"
              :placeholder="t('store.pleaseInputContactEmail')"
            />
          </el-form-item>
          <el-form-item :label="t('store.address')" required>
            <el-input
              v-model="formData.address"
              type="textarea"
              :placeholder="t('store.pleaseInputAddress')"
              :rows="3"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤2: 版本选择 -->
      <div v-if="currentStep === 1" class="step-form">
        <h3>{{ t('store.selectEdition') }}</h3>
        <el-radio-group v-model="formData.selectedEdition" class="edition-group">
          <el-radio
            v-for="edition in editions"
            :key="edition.value"
            :value="edition.value"
            class="edition-radio"
          >
            <div class="edition-card">
              <h4>{{ edition.name }}</h4>
              <p>{{ edition.description }}</p>
              <div class="edition-price">{{ edition.price }}</div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 步骤3: 套餐选择 -->
      <div v-if="currentStep === 2" class="step-form">
        <h3>{{ t('store.selectPackage') }}</h3>
        <el-checkbox-group v-model="formData.selectedPackages" class="package-group">
          <el-checkbox
            v-for="pkg in packages"
            :key="pkg.value"
            :value="pkg.value"
            class="package-checkbox"
          >
            <div class="package-card">
              <h4>{{ pkg.name }}</h4>
              <p>{{ pkg.description }}</p>
              <div class="package-price">{{ pkg.price }}</div>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <!-- 步骤4: 支付信息 -->
      <div v-if="currentStep === 3" class="step-form">
        <h3>{{ t('store.payment') }}</h3>
        <el-form :model="formData" label-width="120px">
          <el-form-item :label="t('store.paymentMethod')" required>
            <el-radio-group v-model="formData.paymentMethod">
              <el-radio value="alipay">{{ t('store.alipay') }}</el-radio>
              <el-radio value="wechat">{{ t('store.wechat') }}</el-radio>
              <el-radio value="bank">{{ t('store.bankTransfer') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('store.totalAmount')">
            <div class="total-amount">{{ formatCurrency(totalAmount) }}</div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤5: 完成 -->
      <div v-if="currentStep === 4" class="step-form">
        <div class="complete-content">
          <el-icon class="success-icon" size="64">
            <Check />
          </el-icon>
          <h3>{{ t('store.createSuccess') }}</h3>
          <p>{{ t('store.createSuccessMessage') }}</p>
          <el-button type="primary" @click="completeCreate">
            {{ t('store.goToStoreList') }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <el-button v-if="currentStep > 0" @click="prevStep">
        {{ t('common.previous') }}
      </el-button>
      <el-button
        v-if="currentStep < totalSteps - 1"
        type="primary"
        @click="nextStep"
      >
        {{ t('common.next') }}
      </el-button>
      <el-button
        v-if="currentStep === totalSteps - 1"
        type="primary"
        @click="submitForm"
      >
        {{ t('common.submit') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { Check } from '@element-plus/icons-vue';
import { useStoreCreate } from '../../hooks/use-store-create';

const { t } = useI18n();

// 使用创建店铺钩子
const {
  currentStep,
  totalSteps,
  steps,
  formData,
  nextStep,
  prevStep,
  submitForm,
  completeCreate,
} = useStoreCreate();

// 店铺类型选项
const storeTypes = ref([
  { label: t('store.retail'), value: 'RETAIL' },
  { label: t('store.wholesale'), value: 'WHOLESALE' },
  { label: t('store.online'), value: 'ONLINE' },
]);

// 版本选项
const editions = ref([
  {
    value: 'basic',
    name: t('store.basicEdition'),
    description: t('store.basicEditionDesc'),
    price: '¥99/月',
  },
  {
    value: 'standard',
    name: t('store.standardEdition'),
    description: t('store.standardEditionDesc'),
    price: '¥199/月',
  },
  {
    value: 'premium',
    name: t('store.premiumEdition'),
    description: t('store.premiumEditionDesc'),
    price: '¥399/月',
  },
]);

// 套餐选项
const packages = ref([
  {
    value: 'inventory',
    name: t('store.inventoryPackage'),
    description: t('store.inventoryPackageDesc'),
    price: '¥50/月',
  },
  {
    value: 'marketing',
    name: t('store.marketingPackage'),
    description: t('store.marketingPackageDesc'),
    price: '¥80/月',
  },
  {
    value: 'analytics',
    name: t('store.analyticsPackage'),
    description: t('store.analyticsPackageDesc'),
    price: '¥60/月',
  },
]);

// 计算总金额
const totalAmount = computed(() => {
  let total = 0;
  // 这里可以根据选择的版本和套餐计算总金额
  return total;
});

// 格式化货币
const formatCurrency = (value: number) => {
  return `¥${value.toFixed(2)}`;
};
</script>

<style lang="scss" scoped>
.store-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .steps {
    margin-bottom: 40px;
  }

  .step-content {
    min-height: 400px;
    margin-bottom: 40px;

    .step-form {
      h3 {
        margin-bottom: 20px;
        color: #333;
      }

      .edition-group,
      .package-group {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .edition-radio,
        .package-checkbox {
          width: 100%;

          .edition-card,
          .package-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #409eff;
              box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
            }

            h4 {
              margin: 0 0 8px 0;
              color: #333;
            }

            p {
              margin: 0 0 12px 0;
              color: #666;
              font-size: 14px;
            }

            .edition-price,
            .package-price {
              font-size: 18px;
              font-weight: bold;
              color: #409eff;
            }
          }
        }
      }

      .total-amount {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
      }

      .complete-content {
        text-align: center;
        padding: 40px 0;

        .success-icon {
          color: #67c23a;
          margin-bottom: 20px;
        }

        h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        p {
          margin: 0 0 24px 0;
          color: #666;
        }
      }
    }
  }

  .step-actions {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
}
</style>

