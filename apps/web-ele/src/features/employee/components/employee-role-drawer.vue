<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useEmployeeRoleForm } from '../hooks/use-employee-role-form';

const { Drawer, Form } = useEmployeeRoleForm();
</script>

