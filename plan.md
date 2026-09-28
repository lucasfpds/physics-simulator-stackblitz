# Simulador de Física em DOM

> Elementos que colidem, quicam e interagem com gravidade no layout usando matter.js.

> **Adaptação:** matter.js está fora do stack definido (Vue + CSS puro, sem libs) — um motor próprio de ~80 linhas cobre 100% do comportamento descrito: gravidade, quique e colisões.

## Stack

- Vite + Vue 3 (`<script setup>`, JavaScript) — sem TypeScript, sem lint/test, zero libs extras
- CSS puro em `src/styles.css`
- Arquivos: `index.html`, `package.json` (deps: `vue`), `vite.config.js`, `.stackblitzrc`, `src/main.js`, `src/App.vue`, `src/composables/usePhysics.js`, `src/styles.css`

## Implementação

### 1. Motor (`src/composables/usePhysics.js`)

- Corpos circulares: `{ x, y, vx, vy, r, cor }`, renderizados como divs (`border-radius: 50%`) posicionados por `transform: translate3d`
- Loop `requestAnimationFrame` com passo fixo:
  - `vy += gravidade * dt`, `x += vx`, `y += vy`, atrito do ar leve (× 0.999)
  - limites do container (chão/teto/paredes): ao cruzar, reposicionar dentro e inverter a componente com restituição 0.8
  - colisão círculo-círculo: `dist < r1 + r2` → separar pelo overlap (metade para cada) + resolução de velocidade ao longo da normal (massa ∝ r²)

### 2. Interações

- Começa com ~6 bolas caindo (efeito imediato ao abrir)
- Clique no palco: cria bola na posição (raio e cor aleatórios)
- Arrastar uma bola: segue o ponteiro (vx/vy zerados durante o gesto); ao soltar, herda a velocidade do último movimento do ponteiro — dá para "jogar" as bolas
- Slider de gravidade (0–2000 px/s²) e botão "limpar"; contador de corpos
- Limite ~60 corpos para manter 60fps; `touch-action: none` no palco

## Checklist — 100% da descrição

- [ ] Gravidade constante agindo nos elementos
- [ ] Elementos quicam (paredes/chão e entre si, com restituição)
- [ ] Colisão entre elementos resolvida
- [ ] Interatividade: criar, arrastar, jogar + gravidade ajustável
