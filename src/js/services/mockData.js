const noticias = [
  {
    id: 1,
    titulo: "Resgate bem-sucedido no centro de Quixadá",
    foto: "/images/noticias/pexels-delot-31440943.webp",
    resumo: "Nossa equipe realizou mais um resgate importante, salvando 3 cachorrinhos que estavam em situação de risco.",
    noticia: "A equipe da Pelu&Cia foi acionada por moradores do centro de Quixadá após a identificação de três cachorrinhos em situação de risco. Com o apoio de voluntários, eles foram recolhidos com segurança e encaminhados para cuidados temporários.",
    data: "2026-04-05",
    tipo: "Resgate",
  },
  {
    id: 2,
    titulo: "Feira de Adoção no Campus UFC foi um sucesso",
    foto: "/images/noticias/pexels-nandamends-16608221.webp",
    resumo: "Doze animais encontraram seus lares definitivos durante a feira de adoção realizada no campus.",
    noticia: "A feira de adoção organizada pela Pelu&Cia no Campus da UFC reuniu estudantes, servidores e moradores da região interessados em adotar com responsabilidade. Ao final da ação, doze animais foram adotados.",
    data: "2026-03-28",
    tipo: "Evento",
  },
  {
    id: 3,
    titulo: "História de Sucesso: Max encontra um lar",
    foto: "/images/noticias/pexels-muhammedtubtemur-20744921.webp",
    resumo: "Conheça a trajetória de Max, que encontrou uma família amorosa após oito meses de acolhimento.",
    noticia: "Max chegou ao projeto ainda filhote, depois de ser encontrado próximo ao campus. Durante oito meses, recebeu cuidados veterinários e alimentação adequada até encontrar um lar definitivo.",
    data: "2026-03-15",
    tipo: "História",
  },
  {
    id: 4,
    titulo: "Campanha de vacinação beneficia 40 animais",
    foto: "/images/noticias/pexels-rashi-rashu-2156740634-35587397.webp",
    resumo: "Com apoio de doações, quarenta animais receberam vacinas essenciais contra doenças graves.",
    noticia: "A Pelu&Cia realizou uma campanha de vacinação voltada aos animais acolhidos e monitorados pelo projeto. Foram aplicadas vacinas e dadas orientações aos tutores temporários.",
    data: "2026-03-08",
    tipo: "Saúde",
  },
  {
    id: 5,
    titulo: "Novo abrigo: expansão das instalações",
    foto: "/images/noticias/pexels-karola-g-5713361.webp",
    resumo: "Com apoio da comunidade, o abrigo foi ampliado para acolher mais animais com segurança.",
    noticia: "A expansão das instalações da Pelu&Cia representa um avanço importante para o acolhimento temporário de animais resgatados. A obra contou com doações de materiais e trabalho voluntário.",
    data: "2026-03-01",
    tipo: "Infraestrutura",
  },
];

const doacoes = {
  pix_chave: "doacoes@pelucia.exemplo",
  pix_favorecido: "Pelu&Cia - dados demonstrativos",
  banco: "Banco de demonstração",
  agencia: "0001",
  conta: "000000-0",
  instituicao: "Conta fictícia para demonstração",
  observacao_transferencia: "Estas informações são fictícias e servem apenas para demonstrar a página.",
};

const contas = [
  { id: 1, tipo: "entrada", valor: 850, descricao: "Doações da comunidade (exemplo)", data: "2026-04-02" },
  { id: 2, tipo: "saida", valor: 320, descricao: "Ração e alimentação (exemplo)", data: "2026-04-03" },
  { id: 3, tipo: "saida", valor: 180, descricao: "Medicamentos veterinários (exemplo)", data: "2026-04-04" },
];

function lerRegistros(chave) {
  try {
    const registros = JSON.parse(localStorage.getItem(chave) || "[]");
    return Array.isArray(registros) ? registros : [];
  } catch {
    return [];
  }
}

function guardarRegistro(chave, registro) {
  const registros = lerRegistros(chave);
  registros.push({ ...registro, criadoEm: new Date().toISOString() });
  localStorage.setItem(chave, JSON.stringify(registros));
}

export function listarNoticiasMock() {
  return [...noticias].sort((a, b) => new Date(b.data) - new Date(a.data));
}

export function obterDoacoesMock() {
  return { ...doacoes };
}

export function listarContasMock() {
  return contas.map((conta) => ({ ...conta }));
}

export function salvarMensagemMock(mensagem) {
  guardarRegistro("pelucia.mock.mensagens", mensagem);
}

export function salvarVoluntarioMock(voluntario) {
  guardarRegistro("pelucia.mock.voluntarios", voluntario);
}
