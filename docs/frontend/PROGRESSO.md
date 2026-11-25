# Interfaces frontend — PeluCIA

Branch: `feat/frontend-admin`. Backend, contratos e imagens originais preservados. Sem commits, push, merge ou PR.

## Acesso pelas rotas normais

Os mesmos componentes e páginas atendem os dois modos. Galeria, ferramentas flutuantes e rotas de prévia foram removidas.

### Desenvolvimento completo sem backend

Após clonar, crie localmente `.env.admin-local` na raiz com `VITE_LOCAL_DATA=true`. Esse arquivo não faz parte da entrega e não deve ser versionado; não contém credenciais. Sem essa configuração explícita, o frontend utiliza a API real.

```powershell
npm.cmd run dev:admin
```

Acesse `http://localhost:5173/login`.

O script executa `vite --mode admin-local`. O arquivo `.env.admin-local` habilita explicitamente `VITE_LOCAL_DATA=true`; a configuração só funciona com `import.meta.env.DEV`.

| Perfil fictício | E-mail | Senha | Destino |
|---|---|---|---|
| Administrador | admin@pelucia.local | admin123 | /admin |
| Voluntário | voluntario@pelucia.local | voluntario123 | /area-voluntario |

As sessões são separadas. Para trocar de perfil, acesse `/login` e entre com a outra conta. O acesso administrativo não autentica automaticamente o voluntário. Logout encerra somente o perfil atual e mantém os registros locais. As sessões expiram após oito horas e não armazenam senhas.

### Ambiente conectado à API

```powershell
npm.cmd run dev:frontend
```

Usa a autenticação e os endpoints existentes; requer backend e configuração administrativa da equipe. Nenhuma falha HTTP/rede ativa simulação automaticamente. Para mudar de fonte, pare o servidor e execute o comando correspondente. Não defina `VITE_LOCAL_DATA=true` no ambiente conectado.

O modo conectado preserva as funções já suportadas pelo backend; as operações ainda sem contrato permanecem na lista de pendências abaixo. O modo local explícito permite executar todos os fluxos frontend sem misturar cadastros fictícios com registros reais.

## Navegação

| Interface | Rota |
|---|---|
| Login dos perfis locais ou administrador real | /login |
| Painel e atalhos | /admin |
| Gestão de notícias | /admin/noticias |
| Prestação de contas | /admin/contas |
| Gestão de voluntários | /admin/voluntarios |
| Perfil, horários e responsabilidades | /area-voluntario |
| Compatibilidade: redireciona para a gestão atual | /admin-noticias → /admin/noticias |

O cabeçalho administrativo permite navegar entre painel, notícias, contas, voluntários e painel pessoal; mantém o mesmo visual, com links operacionais. Todas as páginas administrativas têm logout. Os botões de voltar retornam ao painel. Recarregar ou acessar uma rota diretamente conserva a proteção de acesso.

As páginas públicas permanecem com sua navegação e integrações anteriores. O painel antigo e suas ferramentas de mensagens recebidas, configuração de dados de doação e cadastro manual de voluntários foram descontinuados e não devem ser reintroduzidos. Não existem links para o painel antigo; `/admin-noticias` apenas redireciona para `/admin/noticias`, preservando a proteção de acesso. Os contatos dos modais atuais continuam disponíveis e são distintos da antiga gestão de mensagens recebidas.

## Persistência e isolamento

- `src/js/dev/localStore.js`: única camada de persistência dos registros fictícios.
- Chave: `pelucia.dev.data.v1`, com versão, registros, conversas e sequências de identificadores.
- Registros de exemplo são inseridos apenas se a chave não existir. Recarregar, navegar, sair e voltar a entrar não reinicializam os dados.
- As operações leem o estado salvo antes de alterar e gravam antes de retornar sucesso. Exclusões não fazem IDs serem reutilizados.
- Erros de leitura, dados inválidos ou falta de espaço retornam erro natural, sem substituir silenciosamente o conteúdo armazenado ou anunciar gravação bem-sucedida.
- Perfil, horários e tarefas do voluntário de exemplo são compartilhados com a administração.
- `src/js/dev/session.js`: sessão por perfil em sessionStorage, sem senhas ou token administrativo fictício.
- `src/js/services/adminApi.js`: seleção explícita da fonte, autorização e erros dos contratos HTTP atuais.
- O modo local não consulta APIs nem armazena respostas reais. Utilizar somente dados fictícios nesse ambiente.
- localStorage pertence à origem; `localhost` e `127.0.0.1` têm dados distintos. Use o mesmo endereço para conservar os registros.
- Produção não importa módulos de sessão local, fixtures ou persistência, inclusive se o build for executado com `--mode admin-local`.
- O token real `adminToken` não é criado nem utilizado pelo modo local; sessões locais são ignoradas pelo ambiente conectado e pela produção.

## Funcionalidades disponíveis no modo local

- Notícias: listar, criar com autor, editar e excluir; validação de obrigatoriedade e título duplicado.
- Contas: cadastrar entradas/saídas, observações, filtros e exclusão; totais e saldo recalculados após cada operação.
- Voluntários: busca, filtros, detalhes, aprovação, negativa, remoção, reaprovação e contadores.
- Na aprovação/detalhes do aprovado, informar horários e expandir “Responsabilidades e tarefas” para atribuição de tarefas.
- Área do voluntário: editar perfil, incluir/editar horário semanal e editar responsabilidades pelo ícone junto ao título.
- Contatos: conversa local com histórico; nenhum envio externo é realizado.
- Cancelar/fechar não grava alterações. Mensagens de sucesso dependem da atualização persistida no modo local ou de confirmação HTTP no ambiente conectado.

## Cobertura das 16 referências

Todas foram implementadas e comparadas no navegador; a identidade visual aprovada foi preservada nesta etapa.

| Imagem | Interface | Status visual | Backend real |
|---|---|---|---|
| Painel Adm.png | /admin | Implementada e validada | Navegação/logout |
| Notícias.png | /admin/noticias | Implementada e validada | Lista/criação/exclusão; falta edição/autoria |
| Prestação de Contas.png | /admin/contas | Implementada e validada | CRUD; faltam observações |
| Voluntários.png | /admin/voluntarios | Implementada e validada | Lista; faltam decisões/status/escalas/tarefas |
| Área Voluntário.png | /area-voluntario | Implementada e validada | Autenticação própria/perfil/escalas/tarefas pendentes |
| Card - lançar.png | Modal financeiro | Implementada e validada | Criação; faltam observações |
| Card - nova notícia.png | Modal notícia | Implementada e validada | Criação; falta autoria/edição |
| Card Ver detalhes - visualizar voluntário.png | Modal detalhes | Implementada e validada | Faltam experiência/motivação/status |
| Card Aceitar - visualizar voluntário.png | Modal aprovação | Implementada e validada | Aprovação/escalas pendentes |
| Card - visualizar voluntário.png | Modal perfil | Implementada e validada | Atualização autenticada pendente |
| Card Horários - visualizar voluntário.png | Modal horário | Implementada e validada | Persistência/regras de escala pendentes |
| Footer.png | Rodapé compartilhado | Implementada e validada | Links existentes |
| Footer-1.png | Rodapé compartilhado | Implementada e validada | Links existentes |
| Footer-2.png | Rodapé compartilhado | Implementada e validada | Links existentes |
| Footer-3.png | Rodapé compartilhado | Implementada e validada | Links existentes |
| Footer-4.png | Rodapé compartilhado | Implementada e validada | Links existentes |

## Pendências do backend

1. Autenticação/autorização própria de voluntário, consulta e edição do perfil.
2. Status, aprovação, negativa, reaprovação e remoção de inscrições.
3. Experiência, motivação, área de interesse, horários e tarefas.
4. Política de escalas: recorrência, conflitos e confirmação.
5. Edição e autoria de notícias e política de HTML seguro.
6. Observações financeiras e destino oficial de WhatsApp da equipe.

Nenhum endpoint foi inventado. Conteúdo HTML continua texto escapado; valores de contas devem ser positivos e o saldo vem das movimentações. Categoria e imagem obrigatórias dos contratos reais foram preservadas. CPF/profissão não foram reintroduzidos. Mensagens técnicas não aparecem nas interfaces.

A simulação é um recurso de desenvolvimento, não uma implementação do backend. Não sincronizar automaticamente registros fictícios com um banco real.

## Validação

- Descontinuação do painel antigo: removidos `src/js/pages/adminNoticias.js` e seus seis módulos, o link e estilo “Outras ferramentas”, regras CSS exclusivas, o adaptador `adminFetch` e simulações exclusivas de mensagens recebidas/doações/cadastro manual. Helpers ainda utilizados foram preservados em `src/js/utils/management.js`; estilos de feedback do login e integrações públicas permanecem intactos.
- Após a remoção: 29 cenários funcionais aprovados (CRUD, persistência, autenticação, ausência do link antigo e redirecionamento com recarga); 58 verificações de interface/responsividade e 16 verificações de produção aprovadas, sem erros JavaScript. Busca no código confirma que a única referência restante a `/admin-noticias` é seu redirecionamento. `npm.cmd run build` e `git diff --check` aprovados.
- Rodadas anteriores: comparação das 16 referências, responsividade, teclado, modais, contratos HTTP e isolamento de produção.
- Rodada de unificação anterior (antes da descontinuação das ferramentas antigas): 29 cenários aprovados no Chrome nas rotas normais, incluindo login/logout, CRUD persistente, IDs sem reutilização, contadores, filtros, perfis separados, horários/tarefas sincronizados, cadastro manual, doações, recuperação em novo contexto e erro de armazenamento sem falso sucesso.
- Ambiente conectado: 13 testes de contratos aprovados com HTTP controlado; login/logout real, sessão local ignorada e erro de API sem fallback também verificados.
- Backend/PostgreSQL não foram iniciados nem alterados. Testes de API utilizam respostas controladas, sem banco real.
- 58 verificações de interface aprovadas: cinco páginas em nove larguras (320–1518 px), menu móvel aberto/fechado, seis modais em desktop/mobile, teclado, Escape, retorno de foco, atalhos, voltar e histórico. Ajustado somente o breakpoint do cabeçalho para comportar os links administrativos sem overflow.
- 16 verificações do build servido por Vite aprovadas: seis rotas protegidas, contas/sessões locais ignoradas em produção, login real obrigatório, fixtures e store ausentes do bundle e protótipos fora do build.
- Builds padrão (`npm.cmd run build`) e com configuração local (`npm.cmd run build -- --mode admin-local`) aprovados. Mesmo com a configuração local, `import.meta.env.DEV` é falso no build e elimina todos os módulos simulados.
- `git diff --check` aprovado. Backend, package-lock.json, .gitignore e imagens preservados; package.json recebeu apenas o script de execução local. Nenhum commit, push ou merge realizado.
- Nenhuma dependência foi adicionada. Scripts de navegador executados com Playwright temporário, sem alterar dependências do projeto.
