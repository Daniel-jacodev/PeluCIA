// Dados fictícios de composição. Importado exclusivamente sob import.meta.env.DEV.
const tasks = 'Alimentação matinal, verificação de saúde e registro de comportamento.';
const shifts = [{ dia: 'Seg', inicio: '07:00', fim: '08:30' }, { dia: 'Qua', inicio: '07:00', fim: '08:30' }, { dia: 'Sex', inicio: '07:00', fim: '09:00' }];
export const profileFixture = { nome: 'Ana Paula Souza', email: 'anapaula@example.com', telefone: '88977665544', horarios: shifts, tarefas: tasks };
export const fixtures = {
  '/api/noticias': [
    { id: 1, titulo: 'Resgate bem-sucedido no centro de Quixadá', resumo: 'Nossa equipe realizou mais um resgate importante, salvando 3 cachorrinhos que estavam em situação de risco.', foto: '/images/noticias/noticia-1.webp', data: '2026-04-05', autor: 'Equipe Pelucia', tipo: 'Resgate' },
    { id: 2, titulo: 'Feira de Adoção no Campus UFC foi um sucesso', resumo: 'Evento foi um sucesso! 12 animais encontraram seus lares definitivos durante a feira de adoção.', foto: '/images/noticias/noticia-2.webp', data: '2026-03-28', autor: 'Maria Silva', tipo: 'Evento' },
    { id: 3, titulo: 'História de Sucesso: Max encontra um lar', resumo: 'Conheça a história emocionante de Max, que encontrou uma família amorosa após 8 meses no abrigo.', foto: '/images/noticias/noticia-3.webp', data: '2026-03-15', autor: 'João Santos', tipo: 'História' },
    { id: 4, titulo: 'Campanha de vacinação beneficia 40 animais', resumo: 'Graças às doações, conseguimos vacinar 40 animais contra raiva, cinomose e outras doenças.', foto: '/images/noticias/pexels-rashi-rashu-2156740634-35587397.webp', data: '2026-03-08', autor: 'Equipe Pelucia', tipo: 'Saúde' },
    { id: 5, titulo: 'Nova parceria para castração gratuita', resumo: 'Firmamos parceria com clínica veterinária para oferecer castração gratuita aos animais do campus.', foto: '/images/noticias/noticia-1.webp', data: '2026-03-01', autor: 'Equipe Pelucia', tipo: 'Parceria' },
  ].map((item) => ({ ...item, noticia: `${item.resumo}\n\nA equipe Pelu&Cia agradece o apoio da comunidade e o trabalho de todos os voluntários que participaram desta ação.` })),
  '/api/contas': [
    ['entrada', 'Doação via PIX – campanha Instagram', 200, '2026-10-10'],
    ['saida', 'Ração para cães – 25kg', 180, '2026-10-08'],
    ['entrada', 'Doação via PIX – anônimo', 50, '2026-10-05'],
    ['saida', 'Vermífugo e antipulgas', 75.5, '2026-10-03'],
    ['entrada', 'Doação – Evento de arrecadação', 350, '2026-09-28'],
    ['saida', 'Sachê e ração para gatos', 96, '2026-09-25'],
    ['entrada', 'Doação via PIX – aluno da UFC', 80, '2026-09-20'],
    ['saida', 'Castração – parceria clínica', 0, '2026-09-15', 'Realizado por parceria, sem custo.'],
    ['entrada', 'Doação em produto – ração doada', 120, '2026-09-10', 'Equivalente estimado em reais.'],
    ['saida', 'Material de limpeza (canil)', 42.29, '2026-09-05'],
  ].map(([tipo, descricao, valor, data, observacoes], index) => ({ id: index + 1, tipo, descricao, valor, data, observacoes })),
  '/api/voluntarios': [
    ['Larissa Feitosa', 'pendente', 'Cuidados com Animais', 'manha', '2026-10-10'],
    ['Carlos Melo', 'pendente', 'Eventos e Feiras', 'tarde', '2026-10-09'],
    ['Bruna Alves', 'pendente', 'Cuidados com Animais', 'flexivel', '2026-10-08'],
    ['Thiago Rocha', 'pendente', 'Administrativo', 'finais-de-semana', '2026-10-07'],
    ['Ana Paula Souza', 'aprovado', 'Cuidados com Animais', 'manha', '2026-10-01'],
    ['João Ferreira', 'negado', 'Eventos e Feiras', 'tarde', '2026-09-28'],
  ].map(([nome, status, area, disponibilidade, criado_em], index) => ({ id: index + 1, nome, status, area, disponibilidade, criado_em, email: `${nome.split(' ')[0].toLowerCase()}@example.com`, telefone: '88912345678', experiencia: 'Tenho dois gatos em casa há 5 anos.', motivacao: 'Quero contribuir com os animais da UFC.', ...(status === 'aprovado' ? { horarios: shifts, tarefas: tasks } : {}) })),
};
