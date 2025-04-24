<template>
  <!--  <RouterView />-->
  <RouterView v-slot="{ Component }">
    <Transition name="scale" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </Transition>
  </RouterView>
</template>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
