# Pokédex

Uma Pokédex construída em React + TypeScript consumindo a [PokeAPI](https://pokeapi.co/), como parte de um desafio técnico de frontend.

**Deploy:** https://poke-front-delta.vercel.app

## Funcionalidades

- Listagem de pokémons com nome, sprite e tipos, com paginação incremental ("Carregar mais")
- Busca por nome e filtros combináveis por tipo, geração, altura e peso
- Página de detalhes por pokémon (`/pokemon/:name`) com estatísticas base, habilidades e cadeia de evolução (incluindo cadeias ramificadas, como a do Eevee)
- Favoritar/desfavoritar, com lista de favoritos em `/favoritos`
- Comparação lado a lado de dois pokémons (`/comparar`), com destaque de qual atributo é maior/menor
- Favoritos e filtros persistidos em `localStorage`, sobrevivendo a reloads
- Layout responsivo (grid de 2 colunas no mobile até 5 no desktop; painel de filtros vira um drawer no mobile)

## Rodando localmente

Requisitos: Node 20+ e npm.

```bash
npm install
npm run dev       # http://localhost:5173
```

Outros scripts:

```bash
npm run build     # type-check (tsc) + build de produção
npm run preview   # serve o build de produção localmente
npm run test      # roda os testes (Vitest)
npm run lint      # oxlint
```

## Stack e decisões técnicas

- **Vite + React 19 + TypeScript**, com `strict: true` e `noUncheckedIndexedAccess: true` habilitados manualmente no `tsconfig.app.json` (não vêm ligados por padrão no template). Não há `any` no código — todas as respostas da PokeAPI usadas estão tipadas em `src/types/pokeapi.ts`.
- **Tailwind CSS v4** (via plugin `@tailwindcss/vite`, sem `postcss.config.js`/`tailwind.config.js` — a v4 configura tudo em CSS via `@theme`, ver `src/index.css`), para estilização e responsividade.
- **TanStack React Query** para busca e cache dos dados da PokeAPI. Como a maior parte dos dados (pokémon, tipos, gerações, cadeias de evolução) é estática, as queries usam `staleTime: Infinity` — cada pokémon só é buscado uma vez por sessão, mesmo navegando entre lista, favoritos e comparação.
- **Zustand + `persist`** para o estado global de favoritos e dos filtros/busca ativos, persistido em `localStorage` sob a chave `poke-front:store`.
- **React Router** para as rotas `/`, `/pokemon/:name`, `/favoritos` e `/comparar` (esta última usa query params `?a=&b=`, então a comparação é compartilhável por link).
- **Vitest + React Testing Library** para alguns testes de unidade focados em lógica pura (`src/lib/pokemon.test.ts`: conversões de unidade, parsing de cadeia de evolução ramificada, etc.) e num componente simples (`TypeBadge.test.tsx`). Não é cobertura completa — o foco foi a lógica com maior chance de regressão silenciosa.

### Estratégia de busca/filtro/paginação

A PokeAPI não tem um único endpoint que já traga nome + tipo + altura + peso filtráveis. A estratégia usada (`src/hooks/usePokemonExplorer.ts`):

1. Busca uma vez a lista completa de pokémons (nome + url).
2. Aplica o texto de busca sobre os nomes.
3. Se houver tipos selecionados, busca `/type/{tipo}` para cada um e faz a união dos nomes (um pokémon aparece se tiver **qualquer** um dos tipos selecionados), interseccionando com o resultado da busca.
4. Se houver geração selecionada, busca `/generation/{id}` e intersecciona da mesma forma.
5. Ordena a lista de candidatos e pagina de 20 em 20 — só os pokémons da página visível têm seus detalhes completos buscados (nome, sprite, tipos, altura, peso etc.).
6. **Altura e peso são filtrados no cliente**, sobre os detalhes já buscados — a PokeAPI não expõe esses campos nos endpoints de listagem, então não dá para pré-filtrar sem buscar o detalhe de cada candidato. Na prática, isso significa que ao ativar um filtro de altura/peso a página pode mostrar menos de 20 resultados por "leva", e clicar em "Carregar mais" busca mais candidatos até encontrar mais correspondências. É um trade-off consciente entre simplicidade e nº de requisições — para o volume de dados da PokeAPI (~1300 pokémons) o custo é aceitável.

### Sobre o Figma

O link do Figma fornecido no desafio não pôde ser acessado neste ambiente (arquivo requer login na aplicação web do Figma, e não há integração/plugin disponível aqui para lê-lo). A interface foi construída do zero seguindo convenções usuais de apps de Pokédex (grid de cards, badges de tipo com as cores oficiais de cada tipo, paleta baseada no vermelho da Pokédex), mas **não é uma reprodução pixel-a-pixel da tela do Figma**. Se for necessário aproximar mais do design, uma captura de tela ou os tokens (cores/espaçamentos/fontes) do Figma permitiriam ajustar isso numa iteração seguinte.

## Estrutura do projeto

```
src/
  components/   componentes de UI reutilizáveis (cards, badges, filtros, navbar...)
  pages/        páginas/rotas (Home, Detalhe, Favoritos, Comparar)
  hooks/        hooks de dados (usePokemonExplorer)
  services/     wrappers tipados para a PokeAPI
  store/        estado global (Zustand)
  types/        tipos das respostas da PokeAPI usadas no projeto
  lib/          funções puras (formatação, conversão de unidades, cores de tipo...)
```

## Deploy

Publicado na Vercel: **https://poke-front-delta.vercel.app** (deploy automático a cada push em `main`, via integração Git da Vercel)

O build de produção (`npm run build`) gera um SPA estático em `dist/`, publicável em qualquer host estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Como o roteamento é feito no cliente (React Router), o host precisa redirecionar todas as rotas para `index.html` (ex.: rewrite `/* -> /index.html`) — a Vercel faz isso automaticamente para builds Vite.

Para reimplantar: `npx vercel --prod` (requer login prévio com `npx vercel login`).
