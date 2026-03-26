<script setup lang="ts">
import { PSelect, PSelectOption, type SelectChangeEventDetail } from '@porsche-design-system/components-vue';
import type { ColorScheme } from '@/models/colorScheme.ts';
import { useColorSchemeStore } from '@/stores/color-scheme.ts';

const colorSchemeStore = useColorSchemeStore();

const onChange = (e: CustomEvent<SelectChangeEventDetail>) => {
  colorSchemeStore.setColorScheme(e.detail.value as ColorScheme);
};
</script>

<template>
  <PSelect name="color-scheme" :value="colorSchemeStore.colorScheme" label="Color Scheme" :compact="true" class="w-48" @change="onChange">
    <PSelectOption value="scheme-light">Light</PSelectOption>
    <PSelectOption value="scheme-dark">Dark</PSelectOption>
    <PSelectOption value="scheme-light-dark">Light Dark</PSelectOption>
  </PSelect>
</template>
