# SAMU Admin - Sistema de Gestão Administrativa

Sistema web de gestão administrativa para o SAMU. Painel centralizado para controle de escalas, frotas, estoques e visualização de métricas operacionais, focado na otimização logística e na tomada de decisão no atendimento de urgência.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **NextAuth.js** - Autenticação
- **Recharts** - Gráficos e visualizações

## 📋 Funcionalidades

### Dashboard
- Visão geral com métricas principais
- Gráficos de escalas por função
- Gráfico de status da frota
- Alertas de estoque baixo
- Tabela de escalas recentes

### Gestão de Escalas (Shifts)
- CRUD completo de escalas
- Filtros por status, data e função
- Atribuição de profissionais a veículos

### Gestão de Frotas (Fleet)
- CRUD completo de veículos
- Tipos: USB (Básica), USA (Avançada), Motolância
- Controle de status e manutenção
- Registro de quilometragem

### Gestão de Estoque (Inventory)
- CRUD completo de itens
- Categorias: Medicamentos, Equipamentos, Materiais, Insumos
- Alertas de estoque baixo
- Controle de validade

## 🔐 Autenticação

O sistema utiliza NextAuth.js com autenticação por credenciais.

**Credenciais de demonstração:**
- Email: `admin@samu.gov.br`
- Senha: `samu@2024`

## 🌐 API REST

Todas as rotas da API retornam JSON e requerem autenticação.

### Shifts (Escalas)
```
GET    /api/shifts          - Lista todas as escalas
POST   /api/shifts          - Cria nova escala
GET    /api/shifts/:id      - Obtém escala específica
PUT    /api/shifts/:id      - Atualiza escala
DELETE /api/shifts/:id      - Exclui escala
```

### Fleet (Frotas)
```
GET    /api/fleet           - Lista todos os veículos
POST   /api/fleet           - Cadastra novo veículo
GET    /api/fleet/:id       - Obtém veículo específico
PUT    /api/fleet/:id       - Atualiza veículo
DELETE /api/fleet/:id       - Exclui veículo
```

### Inventory (Estoque)
```
GET    /api/inventory       - Lista todos os itens
POST   /api/inventory       - Cadastra novo item
GET    /api/inventory/:id   - Obtém item específico
PUT    /api/inventory/:id   - Atualiza item
DELETE /api/inventory/:id   - Exclui item
```

### Exemplo de Resposta da API
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Exemplo de Erro
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/                    # Rotas da API
│   │   ├── auth/[...nextauth]/ # Autenticação
│   │   ├── shifts/             # API de escalas
│   │   ├── fleet/              # API de frotas
│   │   └── inventory/          # API de estoque
│   ├── dashboard/              # Páginas do dashboard
│   │   ├── shifts/             # Gestão de escalas
│   │   ├── fleet/              # Gestão de frotas
│   │   └── inventory/          # Gestão de estoque
│   └── login/                  # Página de login
├── components/                 # Componentes reutilizáveis
│   ├── AuthProvider.tsx
│   ├── Charts.tsx
│   ├── DataTable.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── lib/                        # Bibliotecas e utilitários
│   ├── auth.ts                 # Configuração NextAuth
│   └── dataStore.ts            # Armazenamento em memória
├── types/                      # Definições TypeScript
│   └── index.ts
└── middleware.ts               # Middleware de autenticação
```

## 🔄 Integração com Apps Flutter

As rotas da API foram projetadas para serem consumidas por aplicativos externos Flutter. Para autenticar:

1. Faça POST para `/api/auth/callback/credentials` com email e senha
2. Use o token JWT retornado nas requisições subsequentes
3. Inclua o token no header `Authorization: Bearer <token>`

## 📄 Licença

Este projeto está licenciado sob a GNU General Public License v3.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.
