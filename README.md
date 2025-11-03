# 🏥 SUS Para Todos  
### Sistema de Agendamento Público de Consultas e Exames

---

## 🩺 Visão Geral

**SUS Para Todos** é um sistema web que facilita o acesso a serviços de saúde pública, permitindo que cidadãos **agendem consultas e exames** em hospitais municipais, **mantenham um histórico pessoal de saúde** e **acompanhem notícias da área médica**.

O projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** com foco em **aplicação prática e viabilidade real** para uso em redes municipais de saúde.

---

## 🎯 Problema e Solução

### 🚫 Problemas atuais no SUS:
- Agendamentos dependem de filas presenciais ou ligações telefônicas.  
- Falta de centralização das informações médicas do paciente.  
- Dificuldade em acessar disponibilidade de horários.  
- Processos lentos e pouco digitais.

### 💡 Solução proposta:
- Plataforma digital unificada para **agendamentos online**.  
- **Histórico pessoal de saúde** (vacinas, exames, observações).  
- **Painel administrativo** para gestão dos hospitais.  
- **Acesso controlado por papéis (roles)** – cidadãos e administradores.  
- Interface simples, responsiva e acessível a todas as idades.

---

## 🚀 Principais Funcionalidades

### 👤 Para o cidadão (usuário comum)
- **Agendamento de consultas e exames**
  - Seleção de hospital, especialidade, tipo de serviço e data/hora.
- **Gerenciamento de agendamentos**
  - Visualizar, reagendar e cancelar atendimentos.
- **Histórico de Saúde**
  - CRUD pessoal (criar, editar, excluir registros de vacinas, exames e observações).
- **Perfil**
  - Editar telefone e senha, visualizar e-mail e nome.
- **Notícias**
  - Acompanhar comunicados e atualizações de saúde pública.

### 🛡️ Para o administrador
- **Painel `/admin/hospitais`**
  - CRUD completo de hospitais (listar, adicionar, editar e remover).
- **Controle de acesso**
  - Exibição condicional do menu “Admin”.
  - Apenas usuários com `role: "admin"` podem acessar as rotas administrativas.

---

## 🔐 Autenticação e Segurança

- Sessões de login seguras com **Express Sessions**.  
- Middleware `requireAuth` protege rotas de usuários.  
- Middleware `requireAdmin` protege rotas administrativas.  
- Validação de senha forte com **Zod** (mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial).  
- Logout com redirecionamento automático para `/login`.  

---

## 🧱 Arquitetura Técnica

| Camada | Tecnologia | Descrição |
|--------|-------------|------------|
| **Frontend** | React + Vite + TypeScript | Interface responsiva, roteamento com `wouter` e estados assíncronos com React Query |
| **Backend** | Node.js + Express + TypeScript | API REST segura e tipada |
| **Banco de Dados** | PostgreSQL (Neon Serverless) | ORM: Drizzle ORM + migrations automáticas (`drizzle-kit`) |
| **Validação** | Zod | Tipagem e validação de entradas e schemas |
| **Testes** | Vitest | Testes unitários e de integração |
| **Estilo** | TailwindCSS | Interface leve e adaptável com suporte a tema claro/escuro |

---

## 📂 Estrutura de Pastas
<img width="538" height="670" alt="image" src="https://github.com/user-attachments/assets/4034858a-cea8-4c08-a4b9-5a5a3a5ac17e" />


---

## 🗃️ Modelagem de Dados

### 👤 `users`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | Identificador único |
| name | text | Nome completo |
| email | text | E-mail único |
| phone | text | Telefone |
| passwordHash | text | Senha criptografada |
| role | text | `"user"` ou `"admin"` |
| createdAt | timestamp | Data de criação |

### 🏥 `hospitals`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | Identificador do hospital |
| name | text | Nome do hospital |
| address | text | Endereço |
| phone | text | Telefone de contato |

### 📅 `appointments`
- Relaciona `users`, `hospitals` e `specialties`.  
- Armazena data, hora e tipo de serviço (consulta/exame).

### 💉 `health_records`
- CRUD pessoal de histórico de saúde.  
- Campos: `title`, `date`, `notes`, `createdAt`.

---

## 🧠 Destaques Técnicos

- ✅ **Full-stack real:** frontend, backend e banco conectados.  
- ✅ **Compartilhamento de tipos:** schemas Drizzle/Zod usados tanto no front quanto no back.  
- ✅ **Controle de acesso robusto:** middleware separado para autenticação e autorização.  
- ✅ **UX focada no cidadão:** interface simples, legível e responsiva.  
- ✅ **Módulo administrativo pronto:** CRUD completo de hospitais.  
- ✅ **Preparado para escalar:** suporte a PostgreSQL serverless (Neon).

---

## ⚙️ Como Rodar o Projeto Localmente

### 1️⃣ Instalar dependências
bash ou abrindo cmd na pasta raiz do projeto (exemplo no disco C: C:\Users\Nome\Desktop\SaudeOnline)
npm install

### 2️⃣ Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto com:
DATABASE_URL=postgresql://usuario:senha@host:5432/sus_para_todos
SESSION_SECRET=uma_chave_longa_e_aleatoria
PORT=5000
💡 Dica: você pode usar Neon Serverless ou um banco local PostgreSQL.

💡 Melhor opção: mantenha a pasta .env do jeito que está, com banco de dados na nuvem.

### 4️⃣ Rodar o sistema
npm run dev
