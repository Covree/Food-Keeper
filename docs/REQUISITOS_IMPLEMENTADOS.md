# Requisitos implementados

## Funcionais

- RF01 — cadastro e gestão de produtos, categorias e lotes.
- RF02 — validade obrigatória em cada lote.
- RF03 — alertas automáticos de vencimento em até 7 dias, com níveis.
- RF04 — entradas, saídas e perdas registradas com usuário, data, quantidade e motivo.

## Não funcionais

- RNF01 — API organizada para frontend responsivo e operações rápidas.
- RNF02 — persistência centralizada em MySQL; qualquer cliente autorizado acessa os mesmos dados.
- RNF03 — endpoint dedicado para consulta de lote por código/ID e consultas indexadas no banco.
- RNF04 — BCrypt para senhas, JWT para autenticação, RBAC e histórico sem exclusão.

## Requisitos técnicos

- GET/POST/PUT/DELETE presentes.
- DTO + Controller + Service + Repository.
- JPA/Hibernate.
- JPQL customizado.
- Bean Validation.
- Spring Security.
- JWT.
- Swagger/OpenAPI.
- Maven.
- MySQL.
- Flyway.
- MVC.
- @ManyToOne.
- @OneToMany.
- @ManyToMany.
- Tratamento global de erros.

## Observação sobre Lombok

- Lombok foi removido desta versão a pedido da equipe. O código usa Java explícito (construtores, getters e setters).
- Como o enunciado original lista Lombok como obrigatório, esta versão não deve ser apresentada como cumprindo esse item sem autorização do professor.

## Observação sobre "tempo real"

O backend é centralizado e pronto para ser consumido por celular/tablet e painel. O Dashboard pode ser atualizado imediatamente após uma operação do frontend. Para sincronização push em tempo real entre múltiplos clientes, a próxima evolução recomendada é adicionar SSE ou WebSocket, mantendo a API REST atual.
