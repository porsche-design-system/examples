<script setup lang="ts">
import { PWordmark } from '@porsche-design-system/components-vue';
import Form from '@/components/Form.vue';
</script>

<template>
  <main class="grid-template">
    <div class="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
      <PWordmark class="col-wide" />
      <h1 class="col-wide prose-display-md">Porsche Design System</h1>
      <img alt="Vue logo" class="col-wide logo" src="@/assets/logo.svg" width="70"  />
    </div>
    <Form />
  </main>
</template>
