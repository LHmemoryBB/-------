<script setup>
import { computed, defineProps } from 'vue';
import { useAuth } from './useAuth';
const props = defineProps({
  permission: {
    type: [String, Array]
  }
});
const permissions = useAuth();
const showSlot = computed(() => {
  if (!props.permission) {
    return true;
  }
  if (!permissions) {
    return false;
  }
  if (Array.isArray(props.permission)) {
    return props.permission.every((p) => permissions.value.includes(p));
  } else {
    return permissions.value.includes(props.permission);
  }
});
</script>

<template>
  <slot v-if="showSlot" :user-permisstions="permissions"></slot>
</template>

<style></style>
