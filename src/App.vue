<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.page-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.page-enter-active {
  transition: all .5s ease;
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.page-leave-active {
  transition: all .4s ease;
}
</style>
