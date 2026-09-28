<script setup>
import { onMounted } from "vue";
import { usePhysics } from "./composables/usePhysics.js";

const { bodies, gravity, stage, init, clear, onPointerDown, onPointerMove, onPointerUp } = usePhysics();

onMounted(() => {
  init();
});
</script>

<template>
  <main class="app">
    <h1>Simulador de Física</h1>
    <div class="controls">
      <label for="gravity">Gravidade: {{ gravity }} px/s²</label>
      <input id="gravity" type="range" min="0" max="2000" v-model.number="gravity" />
      <span class="count">{{ bodies.length }} corpos</span>
      <button @click="clear">Limpar</button>
    </div>
    <div
      ref="stage"
      class="stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        v-for="b in bodies"
        :key="b.id"
        class="ball"
        :style="{
          width: b.r * 2 + 'px',
          height: b.r * 2 + 'px',
          transform: `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`,
          background: b.color,
        }"
      ></div>
    </div>
    <p class="hint">Clique para criar · arraste para mover e jogar</p>
  </main>
</template>
