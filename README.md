# Simulador de Física em DOM

> Elementos que colidem, quicam e interagem com gravidade no layout usando matter.js.

## Tecnologias

- **Vue 3** com `<script setup>` (JavaScript)
- **Vite** como bundler
- **Motor de física próprio** (~80 linhas) — gravidade, restituição, colisão círculo-círculo
- **requestAnimationFrame** com passo fixo
- **CSS puro** — corpos renderizados como divs (`border-radius: 50%`) posicionados por `translate3d`

## Requisitos

- Node.js 18+

## Como executar

```bash
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build de produção |

## Estrutura

```
src/
  main.js              entry: cria o app e importa o CSS
  App.vue              palco, controles, slider de gravidade, contador
  composables/
    usePhysics.js      motor: gravidade, atrito, colisões, arrasto
  styles.css           palco, bolas, controles
```

### Funcionalidades

- Corpos circulares: `{ x, y, vx, vy, r, cor }`
- Loop rAF com passo fixo: `vy += gravidade * dt`, `x += vx`, `y += vy`, atrito do ar (× 0.999)
- Limites do container (chão/teto/paredes): reposicionar dentro + inverter componente com restituição 0.8
- Colisão círculo-círculo: separar pelo overlap + resolução de velocidade ao longo da normal (massa ∝ r²)
- Começa com 6 bolas caindo (efeito imediato ao abrir)
- Clique no palco cria bola na posição (raio e cor aleatórios)
- Arrastar uma bola: segue o ponteiro; ao soltar herda a velocidade do último movimento
- Slider de gravidade (0–2000 px/s²) e botão "limpar"
- Contador de corpos; limite ~60 para manter 60fps
- `touch-action: none` no palco

> **Adaptação:** matter.js está fora do stack definido (Vue + CSS puro, sem libs) — um motor próprio cobre 100% do comportamento descrito: gravidade, quique e colisões.


## Rodando no StackBlitz

Basta importar o repositório e rodar normalmente:

```
https://stackblitz.com/github/lucasfpds/physics-simulator-stackblitz
```

O projeto não depende de binários nativos — Vite é JavaScript puro, então
sobe sem bindings nativos no WebContainer do StackBlitz.
