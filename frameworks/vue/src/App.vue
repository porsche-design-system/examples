<script setup lang="ts">
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <PorscheDesignSystemProvider>
    <RouterView />
  </PorscheDesignSystemProvider>
</template>
