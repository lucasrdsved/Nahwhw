# EvoFit - PWA ULTIMATE (Next.js + Mock Supabase)

EvoFit é a versão definitiva do PWA para personal trainers, construído com **Next.js (App Router)** e uma arquitetura de **backend simulado** que espelha perfeitamente o `supabase-js`.

Esta versão foi projetada para permitir um desenvolvimento de frontend ultra-rápido e uma migração para um backend Supabase real com esforço zero.

![EvoFit Screenshot](https://picsum.photos/seed/app-next/1200/600)

## ✨ Features

- **Arquitetura Next.js**: Utiliza o App Router para uma estrutura moderna, performance otimizada e Server Components.
- **Backend Simulado (Zero Config)**: Um cliente Supabase falso (`/lib/supabaseClient.ts`) que usa `localStorage` e dados locais, mas mantém 100% da assinatura do `supabase-js` (e.g., `supabase.from(...).select(...)`).
- **UI Premium**: Interface inspirada no Apple Fitness e GymPass, com componentes reutilizáveis, Dark Mode e animações suaves.
- **PWA Completo**: Manifest e Service Worker para uma experiência offline-first e instalável.
- **Pronto para Migração**: Para conectar ao Supabase real, basta alterar o arquivo `/lib/supabaseClient.ts` com suas credenciais. O resto do app funcionará sem nenhuma alteração.

## 🛠️ Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Backend (Simulado)**: Mock do `supabase-js` com dados em JSON e persistência via `localStorage`.
- **PWA**: Manifest e Service Worker customizado.

---

## 🚀 Rodando o Projeto

**Este é um projeto Next.js e requer Node.js e npm/yarn/pnpm.**

1.  **Instale as dependências**:
    ```bash
    npm install
    ```

2.  **Rode o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

3.  **Abra no navegador**:
    - Abra `http://localhost:3000` no seu navegador.

O app iniciará na tela de login. Use um dos e-mails do banco de dados simulado para entrar:
-   **Personal:** `personal@evofit.com`
-   **Aluno:** `bruno@evofit.com`
-   (A senha pode ser qualquer coisa, a validação é mockada).

## 📁 Estrutura do Projeto

-   `/app`: Contém todas as rotas da aplicação, seguindo o padrão do App Router.
    -   `/app/login`: Rota de autenticação.
    -   `/app/(app)`: Grupo de rotas protegidas da aplicação principal (dashboard, treinos, etc).
    -   `layout.tsx`: Layouts de cada grupo de rotas.
    -   `page.tsx`: Páginas da aplicação.
-   `/components`: Componentes React reutilizáveis (UI, cards, timers).
-   `/lib`: O coração do backend simulado.
    -   `apiMock.ts`: Implementação do cliente Supabase falso.
    -   `authMock.ts`: Simulação de autenticação e sessão.
    -   `mockDB.ts`: O banco de dados em formato JSON.
    -   `supabaseClient.ts`: **Ponto de entrada.** É aqui que você trocará o cliente mock pelo real.
-   `/public`: Arquivos estáticos, incluindo o manifest do PWA, ícones e o service worker.
-   `/types`: Definições de tipos TypeScript para todo o projeto.

## 🔄 Migrando para o Supabase Real

A arquitetura foi pensada para tornar esta etapa trivial.

1.  **Instale o cliente Supabase**:
    ```bash
    npm install @supabase/supabase-js
    ```

2.  **Crie suas variáveis de ambiente**:
    Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Supabase:
    ```
    NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
    ```

3.  **Atualize o `lib/supabaseClient.ts`**:
    Comente a importação do cliente mock e descomente a do cliente real.

    ```typescript
    // Em /lib/supabaseClient.ts

    // 1. Comente ou remova a linha do mock
    // export * from './apiMock';

    // 2. Descomente estas linhas
    import { createClient } from '@supabase/supabase-js';
    // import { Database } from '../types/supabase'; // (Opcional, se você gerar tipos)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    export const supabase = createClient/*<Database>*/(supabaseUrl, supabaseAnonKey);
    ```

**Pronto!** Toda a aplicação agora estará usando seu backend Supabase real, sem a necessidade de alterar nenhum outro arquivo.
