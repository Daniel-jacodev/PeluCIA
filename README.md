# Pelu&Cia

Site da Pelu&Cia em modo de demonstração. O frontend roda sem API ou banco de dados: notícias, doações e prestação de contas vêm de dados mockados em `src/js/services/mockData.js`.

Os formulários de contato e voluntariado mostram uma confirmação simulada e guardam os registros no `localStorage` do navegador atual. Esses envios não chegam à equipe. Os dados financeiros são fictícios e não devem ser usados para doações reais.

## Executar o frontend

Requisitos: Node.js e npm.

```bash
npm install
npm run dev:frontend
```

Abra `http://localhost:5173`. Não é necessário iniciar o backend, PostgreSQL ou Docker para navegar pelo site.

## Scripts

- `npm run dev` ou `npm run dev:frontend`: inicia o frontend Vite.
- `npm run build`: gera o build de produção do frontend.

O repositório ainda contém o backend Express/PostgreSQL separado, mas o frontend atual não o consome. Consulte `backend/README.md` para a documentação desse serviço.

## Estrutura

```txt
src/       Frontend Vite e dados mockados
public/    Imagens e arquivos públicos
backend/   Serviço Express/PostgreSQL independente do frontend atual
docs/      Documentação do projeto
```
