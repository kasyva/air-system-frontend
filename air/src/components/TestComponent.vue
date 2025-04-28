<!-- src/components/TestComponent.vue -->
<template>
  <div>
    <p data-testid="clicked">Times clicked: {{ count }}</p>
    <button data-testid="increment" @click="increment">increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count += 1;
    },
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>
