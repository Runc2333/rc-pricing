<template>
  <div id="root">
    <span class="title" v-if="title.length > 0">{{ title }}</span>
    <div class="slot_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
#root {
  width: 100%;
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  padding: 6px 12px;
  transition: all 0.3s ease;
}

#root:hover {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  border-radius: 0;
}
</style>