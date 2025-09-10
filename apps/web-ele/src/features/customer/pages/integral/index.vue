<template>
  <Page auto-content-height>
    <div class="integral-container">
      <!-- 积分设置 -->
      <div class="section">
        <div class="section-title">
          <span>{{ t('customers.integralsetting') }}</span>
        </div>
        <Form />
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useCustomerIntegralForm } from '../../hooks/use-customer-integral-form';

defineOptions({
  name: 'ICustomerIntegral',
});

const { t } = useI18n();
const { Form } = useCustomerIntegralForm();
</script>

<style scoped lang="scss">
.integral-container {
  .section {
    background: #ffffff;
    margin-bottom: 16px;
    border-radius: 8px;
    padding: 24px;
    
    .section-title {
      border-left: 6px solid #0d99ff;
      padding-left: 12px;
      margin-bottom: 24px;
      font-size: 16px;
      font-weight: 600;
      color: #323232;
    }
  }
}
</style>

