<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCreateCustomerDrawer } from '../hooks/use-create-customer-drawer';

const { Drawer, Form } = useCreateCustomerDrawer();
</script>

<style lang="scss" scoped>
.drawer-title {
  height: 112px;
  text-align: left;
  padding-top: 37px;
  padding-left: 50px;
  padding-right: 50px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 24px;
    margin: 0;
  }

  .right {
    .drawer-btn {
      padding: 8px 16px;

      .outer {
        display: flex;
        align-items: center;
        gap: 8px;

        .inner-left {
          i {
            font-size: 14px;
          }
        }

        .inner-right {
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.drawer-content {
  padding: 30px 50px;

  .form-container {
    .customer-form {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
  }

  .btn-box {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .cancel-btn {
      padding: 10px 30px;
    }

    .save-btn {
      padding: 10px 30px;
    }
  }
}
</style>
