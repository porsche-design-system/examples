<script setup lang="ts">
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-vue';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/theme.ts';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <PorscheDesignSystemProvider>
    <RouterView />
  </PorscheDesignSystemProvider>
</template>
