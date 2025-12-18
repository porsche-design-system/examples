<script setup lang="ts">
import { PSelect, PSelectOption, type SelectChangeEventDetail } from '@porsche-design-system/components-vue';
import type { Theme } from '@/models/theme';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const onChange = (e: SelectChangeEventDetail) => {
  themeStore.setTheme(e.value as Theme);
};
</script>

<template>
  <PSelect name="theme" :value="themeStore.theme" label="Theme" :compact="true" class="w-48" @change="onChange">
    <PSelectOption value="light">Light</PSelectOption>
    <PSelectOption value="dark">Dark</PSelectOption>
    <PSelectOption value="auto">Auto</PSelectOption>
  </PSelect>
</template>
