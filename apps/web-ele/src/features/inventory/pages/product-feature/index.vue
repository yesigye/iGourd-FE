<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton 
          @click="drawerApi.open()"
          :disabled="isMaxItems"
        >
          {{ t('inventory.addProductFeature') }}
        </IgourdButton>
      </template>
      <template #table-field>
        
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { Page, IgourdButton } from '@igourd/common-ui';
import { useInventoryProductFeatureList } from '../../hooks/use-inventory-product-feature-list';

defineOptions({
  name: 'IInventoryProductFeatureList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, isMaxItems } = useInventoryProductFeatureList();
</script>
