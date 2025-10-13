<template>
  <div class="form-row">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10px;
}

@media screen and (max-width: 1150px) {
  .form-row {
    flex-direction: column;
    width: 500px;
  }
}
</style>
