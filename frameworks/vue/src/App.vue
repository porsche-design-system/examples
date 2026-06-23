<script setup lang="ts">
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-vue';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useColorSchemeStore } from '@/stores/color-scheme.ts';

const colorSchemeStore = useColorSchemeStore();

onMounted(() => {
  colorSchemeStore.initColorScheme();
});
</script>

<template>
  <PorscheDesignSystemProvider>
    <RouterView />
  </PorscheDesignSystemProvider>
</template>
