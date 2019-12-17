<template>
  <div>
    <span @click="expanded = !expanded">
      <i :class="expanded ? 'icon-expand-down' : 'icon-expand'"></i>
      {{ title }}
    </span>
    <div v-show="expanded">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
  data: () => ({
    expanded: false
  })
};
</script>
