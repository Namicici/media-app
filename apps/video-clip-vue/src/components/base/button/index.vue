<style lang="less" scoped>
.button {
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  margin: auto;
}
.type-primary {
  background-color: var(--primary-color);
  &:hover {
    background-color: var(--primary-hover-color);
  }
}
.type-default {
  &:hover {
    opacity: 0.5;
  }
}
</style>
<template>
  <div class="button" :class="`${type ? 'type-' + type : ''}`">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  size: { type: String, default: "middle", valid: (val: string) => ["large", "small", "middle"].includes(val) },
  type: { type: String, default: "default", valid: (val: string) => ["default", "primary", "text"].includes(val) },
});
</script>
