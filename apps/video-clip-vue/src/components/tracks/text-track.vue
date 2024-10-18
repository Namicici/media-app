<style lang="less" scoped>
.text-track {
  background-color: var(--primary-color);
}
</style>
<template>
  <ActiveBox :active="selected.id === item.id" class="text-track" v-for="item in data" :key="item.id"></ActiveBox>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
import ActiveBox from "./active-box.vue";
import type { TimelineAction } from "@/views/editor/edit";

defineProps<{
  data: Array<TimelineAction>;
  selected: TimelineAction;
}>();
</script>
