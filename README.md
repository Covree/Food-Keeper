# Food Keeper — Backend

Backend REST do projeto Food Keeper para controle de estoque, lotes, validade, entradas, saídas, perdas e alertas.

## Stack

- Java 21
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- Hibernate
- MySQL 8
- Flyway
- Spring Security
- JWT
- Bean Validation
- Swagger / OpenAPI
- Maven

## Arquitetura

Controller -> DTO -> Service -> Repository -> JPA/Hibernate -> MySQL

## Requisitos

- JDK 21
- Maven 3.9+
- Docker Desktop (opcional, recomendado para o MySQL)

## Executar com Docker (MySQL + API + Frontend)

Toda a configuração da aplicação está no `docker-compose.yml` (não existe mais `application.yml`).

```bash
cp .env.example .env   # opcional
docker compose up -d --build
docker compose logs -f backend
```

- Frontend: http://localhost:3000 (nginx; repassa `/api` para o backend, sem CORS)
- API/Swagger: http://localhost:8080/swagger-ui.html
- MySQL no host: `localhost:3307` (a porta externa é configurável por `MYSQL_HOST_PORT`; dentro do Docker é `mysql:3306`).

Variáveis aceitas no `.env`: `APP_PORT`, `FRONTEND_PORT`, `MYSQL_HOST_PORT`, `MYSQL_DATABASE`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS`, `ALERTS_CRON`, `SEED_ADMIN_ENABLED`, `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

Para recomeçar com o banco vazio: `docker compose down -v`.

## Executar pela IDE (sem Docker para a API)

Suba só o banco (`docker compose up -d mysql`) e defina estas variáveis de ambiente na configuração de execução:

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/food_keeper?useSSL=false&serverTimezone=America/Sao_Paulo&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SECURITY_JWT_SECRET=uma-chave-com-pelo-menos-32-caracteres-aqui
```

## Swagger

Depois de iniciar:

- http://localhost:8080/swagger-ui.html
- http://localhost:8080/v3/api-docs

## Autenticação

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. Copie o `token`.
4. No Swagger, clique em **Authorize**.
5. Informe o JWT no campo Bearer.

## Principais endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

### Categorias

- GET `/api/categorias`
- POST `/api/categorias`
- DELETE `/api/categorias/{id}`

### Produtos

- GET `/api/produtos`
- GET `/api/produtos/{id}`
- POST `/api/produtos`
- PUT `/api/produtos/{id}`
- DELETE `/api/produtos/{id}`

### Lotes

- GET `/api/lotes/{id}`
- GET `/api/lotes/vencendo?dias=7`
- POST `/api/lotes`
- PUT `/api/lotes/{id}`
- DELETE `/api/lotes/{id}`

### Movimentações

- POST `/api/movimentacoes`
- POST `/api/movimentacoes/entrada`
- POST `/api/movimentacoes/saida`
- POST `/api/movimentacoes/perda`
- GET `/api/movimentacoes`

### Alertas

- GET `/api/alertas`
- GET `/api/alertas/nao-lidos`
- PATCH `/api/alertas/{id}/ler`
- POST `/api/alertas/gerar`

### Dashboard

- GET `/api/dashboard`

## Regras importantes

- Data de validade é obrigatória.
- A API bloqueia validade anterior à data atual.
- Saída/perda não pode exceder o estoque disponível no lote.
- Senhas são armazenadas com BCrypt.
- Rotas protegidas exigem JWT.
- Funcionários não podem apagar produtos.
- Exclusão de produto é lógica (soft delete).
- Histórico de movimentações não possui endpoint de exclusão.
- Alertas de vencimento são gerados automaticamente a cada hora por padrão.
- O frontend pode consultar `/api/dashboard` após uma operação para atualizar o painel.

## Teste com Postman / Insomnia

Recomendação:

1. Login.
2. Salvar o JWT em uma variável de ambiente.
3. Enviar `Authorization: Bearer {{token}}`.
4. Criar categorias.
5. Criar produto.
6. Criar lote.
7. Registrar entrada/saída/perda.
8. Consultar dashboard e alertas.

## Observação sobre produção

Antes de publicar em nuvem:

- troque `JWT_SECRET`;
- use senha forte no MySQL;
- configure CORS para os domínios reais do frontend;
- não use credenciais padrão;
- configure HTTPS;
- use secrets do provedor de nuvem;
- configure backup do MySQL;
- monitore logs e health checks.


## Importação no Spring Tools Suite (STS)

1. Extraia o ZIP.
2. No STS: `File > Import > Maven > Existing Maven Projects`.
3. Selecione a pasta que contém o `pom.xml`.
4. Aguarde o Maven baixar todas as dependências.
5. Clique com o botão direito no projeto > `Maven > Update Project...` e marque `Force Update of Snapshots/Releases`.
6. Confirme que o STS usa JDK 21 em `Window > Preferences > Java > Installed JREs`.
7. Só depois execute `FoodKeeperApplication.java` como `Spring Boot App`.

## STS / Eclipse
A versão V4 não utiliza Lombok. Entidades, DTOs e classes de serviço usam construtores, getters e setters Java explícitos para evitar dependência de processamento de anotações no IDE. Isso facilita a abertura do projeto no Spring Tools/Eclipse.

> **Atenção acadêmica:** o enunciado original do trabalho informa Lombok como tecnologia obrigatória. Esta V4 foi feita sem Lombok a pedido da equipe; portanto, antes da entrega, confirme com o professor se essa exceção é aceita.
