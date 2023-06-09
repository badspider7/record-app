<template>
  <div class="suspend-page" v-mouse-drag="handleDrag">
    <div class="ball" ref="ballRef">{{ timeFormat(timestamp) }}</div>
  </div>
</template>
<script setup>
const timer = ref(null);
const timestamp = ref(0);

const countDown = () => {
  console.log("启动了定时器");
  timestamp.value++;
  timer.value = setTimeout(() => {
    countDown();
  }, 1000);
};

const transTime = (time) => {
  let h =
    Math.floor(time / 3600) >= 10
      ? Math.floor(time / 3600)
      : "0" + Math.floor(time / 3600);
  let m =
    Math.floor(time / 60) % 60 >= 10
      ? Math.floor(time / 60) % 60
      : "0" + (Math.floor(time / 60) % 60);
  let s =
    Math.floor(time % 60) >= 10
      ? Math.floor(time % 60)
      : "0" + Math.floor(time % 60);

  return `${h}:${m}:${s}`;
};
</script>
<style lang="scss" scoped>
html,
body {
  border-radius: 50%;
  overflow: hidden;
  background: transparent !important;
}
.suspend-page {
  user-select: none;
  position: relative;
  height: 100%;
  width: 100%;
  padding: 3px;
  .ball {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #5bc6ef;
    box-shadow: 0 0 2px 2px #fcfeff;
    color: #fff;
  }
}
</style>
