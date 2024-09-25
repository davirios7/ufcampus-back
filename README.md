# UFCampus API

Repositório com o código referente ao back-end do segundo trabalho da disciplina de Tecnologias Web II

```
ufcampus-back/
│
├── scr/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── email.controller.ts
│   │   └── users.controller.ts
│   ├── middlewares/
│   │   └── authenticateToken.ts
│   ├── models/
│   │   ├── tarefa.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   └── users.ts
│   └── server.ts
│
├── .gitignore
├── .prettierrc
├── package.json
├── pnpm-local.yaml
├── README.md
└── ts.config.json
```

## Linguagem utilizada

- TypeScript

## Requisitos

- **Pnpm:** 9.4.0 ou superior

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/davirios7/ufcampus-back
```

Entre no diretório do projeto

```bash
  cd ufcampus-back
```

Instale as dependências

```bash
  pnpm install
```

Inicie o projeto

```bash
  pnpm run dev
```

Servidor hospedado na porta 3001.

## Autores

- [@davirios7](https://www.github.com/davirios7)

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
