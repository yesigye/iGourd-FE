<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div>
    <div class="list-box-title" v-if="title || $slots['header-right']">
      <span v-if="title">{{ title }}</span>
      <div class="header-right-slot">
        <slot name="header-right"></slot>
      </div>
    </div>
    <div class="form-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-box-title {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  margin-bottom: 10px;
}

.header-right-slot {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.form-content {
  margin-bottom: 20px;
}
</style>
