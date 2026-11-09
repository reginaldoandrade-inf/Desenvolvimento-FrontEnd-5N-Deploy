# Gerenciador de Tarefas Acadêmicas

Projeto desenvolvido para a disciplina de **Desenvolvimento Frontend**, utilizando **React + TypeScript + Vite** e **json-server**.

## Equipe

**DEPLOY**

### Integrantes

- Julio Alexandre Costa Neto
- Lucas Wagner Araújo
- Luis Vinicius da Silva Costa
- Reginaldo Santos Andrade

## Disciplina

**Desenvolvimento Frontend — 2026.2**

**Professora:** Marianne Lacerda Dutra Theodoro  
GitHub: `@mariannedutra`

## Tecnologias

- React
- TypeScript
- Vite
- json-server

## Como executar

Clone o repositório:

```bash
git clone https://github.com/reginaldoandrade-inf/Desenvolvimento-FrontEnd-5N-Deploy.git
```

Entre na pasta:

```bash
cd Desenvolvimento-FrontEnd-5N-Deploy
```

Instale as dependências:

```bash
npm install
```

Execute o frontend:

```bash
npm run dev
```

Em outro terminal, execute a API:

```bash
npx json-server db.json
```


## Endereços da aplicação

### Front-end — Desenvolvimento local

Após executar `npm run dev`, acesse:

http://localhost:5173

### Front-end — Produção (Render)

Aplicação publicada:

- Tarefas: https://desenvolvimento-frontend-5n-deploy-front.onrender.com/tarefas
- Quadro Kanban: https://desenvolvimento-frontend-5n-deploy-front.onrender.com/quadro
- Projetos: https://desenvolvimento-frontend-5n-deploy-front.onrender.com/projetos

## API

### API — Desenvolvimento local

Após executar `npx json-server db.json`, a API ficará disponível em:

http://localhost:3000

Endpoints principais:

- Tarefas: http://localhost:3000/tarefas
- Projetos: http://localhost:3000/projetos

### API — Produção (Render)

API hospedada pela equipe:

https://desenvolvimento-frontend-5n-deploy.onrender.com

Endpoints principais:

- Tarefas: https://desenvolvimento-frontend-5n-deploy.onrender.com/tarefas
- Projetos: https://desenvolvimento-frontend-5n-deploy.onrender.com/projetos
