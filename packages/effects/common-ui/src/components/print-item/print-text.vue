<template>
  <div class="store-name" :style="props.styleOptions">
    <p class="store-name-item">{{ props.title }}:</p>
    <p class="store-name-item">
      {{ props.value }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  itemStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },
  styleOptions: {
    type: Object,
    default: () => {
      return {}
    },
  },
  width: {
    type: String,
    default: '50%',
  },
})
</script>
<style lang="scss" scoped>
.store-name {
  display: flex;
  align-items: start;
  justify-content: space-between;

  .store-name-item {
    width: 50%;
  }
  :first-child {
    text-align: left;
  }
  :last-child {
    text-align: right;
  }
}
</style>
