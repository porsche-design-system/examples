<script setup lang="ts">
import { PWordmark } from '@porsche-design-system/components-vue';
import Form from '@/components/Form.vue';
</script>

<template>
  <main class="grid-template">
    <div class="grid justify-items-center col-span-full gap-fluid-md m-static-lg p-fluid-lg bg-surface rounded-lg">
      <PWordmark />
      <h1 class="prose-display-md">Porsche Design System</h1>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </div>
    <Form />
  </main>
</template>
