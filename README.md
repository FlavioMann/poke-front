# Pokédex 🎮

Uma Pokédex construída em React + TypeScript consumindo a [PokeAPI](https://pokeapi.co/). 🚀
Está disponível em [poke-front-delta.vercel.app](https://poke-front-delta.vercel.app).

## 📜 Sobre

SPA para explorar, filtrar, favoritar e comparar pokémons.

- Listagem com busca e filtros por tipo, geração, altura e peso
- Página de detalhes com estatísticas, habilidades e cadeia de evolução
- Favoritos e comparação lado a lado entre dois pokémons
- Filtros e favoritos persistidos no navegador
- Layout responsivo

## ✅ Requisitos do desafio

**Consumo de API**
- Listagem com paginação via botão "Carregar mais" (`usePokemonExplorer`), 20 pokémons por vez, cada card com nome, sprite e tipos (`PokemonCard`).
- Detalhes completos em rota dedicada `/pokemon/:name` (`PokemonDetailPage`): stats, habilidades, altura/peso, fraquezas e cadeia de evolução.

**Gerenciamento de estados**
- Favoritar/desfavoritar com estado global em Zustand (`useAppStore`), persistido em `localStorage`. Lista de favoritos em `/favoritos`.

**Filtros**
- Busca por nome (`SearchBar`) e filtro por tipo (`TypeSheet`), combináveis entre si.

**Responsividade**
- Grid adaptável (1 coluna no mobile, 2 no tablet, 3 no desktop) e navegação por `BottomNav` no mobile / `Navbar` no desktop.

## 💎 Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, TanStack React Query, Zustand e React Router. Testes com Vitest + React Testing Library.

### 📋 Requisitos

- [Node.js](https://nodejs.org/en/) 20+
- [npm](https://npmjs.com/)

## 💻 Desenvolvendo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # type-check + build de produção
npm run preview    # serve o build localmente
npm run test       # testes (Vitest)
npm run lint       # linter (oxlint)
```

## 🗂️ Estrutura do projeto

```
src/
  components/   componentes de UI reutilizáveis
  pages/        páginas/rotas
  hooks/        hooks de dados
  services/     wrappers para a PokeAPI
  store/        estado global (Zustand)
  types/        tipos das respostas da PokeAPI
  lib/          funções puras (formatação, conversões, etc.)
```

## 🚀 Deploy

Publicado na Vercel: **https://poke-front-delta.vercel.app** (deploy automático a cada push em `main`).
