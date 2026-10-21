# Food Keeper — Front-End

Front-end em React (JavaScript + CSS puro) para o back-end Food Keeper (Spring Boot),
um sistema de controle de estoque e validade de alimentos.

## Como rodar

Pré-requisitos: Node.js 18+ e o back-end rodando (por padrão em `http://localhost:8080`).

```bash
npm install
npm run dev
```

O app abre em `http://localhost:5173`. A URL da API é configurada em `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

Para gerar a build de produção:

```bash
npm run build
```

## Arquitetura e organização de pastas

```
src/
├── assets/          # imagens e ícones estáticos
├── components/
│   ├── common/      # componentes reutilizáveis e sem regra de negócio
│   │                 (Button, Input, Select, Modal, DataTable, Badge, etc.)
│   └── layout/       # casca da aplicação (Sidebar, Topbar, AppLayout, ProtectedRoute)
├── contexts/         # AuthContext — estado global de sessão
├── hooks/            # useAuth, useFetch (hooks reutilizáveis)
├── pages/            # uma pasta por domínio de tela
│   ├── products/      # ProductsPage + ProductForm (lógica isolada da UI genérica)
│   ├── batches/        # BatchesPage + BatchForm
│   ├── movements/       # MovementsPage + MovementForm
│   └── LoginPage, RegisterPage, DashboardPage, CategoriesPage, AlertsPage
├── services/          # uma função por recurso da API (productService, batchService...)
│                        toda chamada HTTP fica isolada aqui, nunca dentro de componentes
├── styles/            # variables.css (design tokens), global.css, forms.css
└── utils/             # constants.js (enums do back-end) e formatters.js
```

### Decisões de arquitetura

- **Camada de serviços isolada**: nenhum componente chama `fetch`/`axios` diretamente.
  Toda a comunicação HTTP passa por `services/`, que espelham 1:1 os endpoints do
  back-end (`/api/produtos`, `/api/lotes`, `/api/movimentacoes` etc.).
- **`api.js`** centraliza a instância do Axios, injeta o token JWT em cada requisição
  e trata erros 401 (sessão expirada) de forma global.
- **Componentes `common/` sem regra de negócio**: `Button`, `Input`, `Modal`, `DataTable`
  etc. não sabem nada sobre "produto" ou "lote" — recebem dados via props e são
  reutilizados em todas as telas.
- **Formulários por domínio** (`ProductForm`, `BatchForm`, `MovementForm`) ficam junto
  da página que os usa, mantendo a lógica de cada entidade coesa e fácil de achar.
- **`utils/constants.js`** espelha os enums Java do back-end (`UnitOfMeasure`,
  `StorageSector`, `MovementType`, `AlertType`, `Role`) com rótulos em português,
  evitando strings mágicas espalhadas pelo código.
- **`AuthContext` + `ProtectedRoute`**: sessão do usuário fica disponível globalmente;
  rotas internas exigem login e podem futuramente restringir por `role`.

## Papéis de usuário (definidos pelo back-end)

- `ADMIN`: acesso completo, único que pode excluir categorias.
- `GESTOR`: pode excluir produtos/lotes e gerar alertas manualmente.
- `FUNCIONARIO`: uso operacional (consultas, registrar movimentações).

## Páginas implementadas

| Rota                   | Descrição                                             |
|-------------------------|--------------------------------------------------------|
| `/login`, `/registro`   | Autenticação                                            |
| `/`                     | Dashboard com métricas e alertas                        |
| `/produtos`             | CRUD de produtos, com busca e paginação                 |
| `/categorias`           | Listagem e criação de categorias                        |
| `/lotes`                | Lotes por prazo de validade, criação de novo lote        |
| `/movimentacoes`        | Histórico paginado + registro de entrada/saída/perda     |
| `/alertas`              | Lista de alertas, marcar como lido, gerar manualmente     |
