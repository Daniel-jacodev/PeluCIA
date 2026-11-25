import { icon } from '../components/icons.js';

export function renderAdminDashboard() {
  const actions = [
    ['/admin/voluntarios', 'users', 'Voluntários', 'Gerenciar inscrições', 'blue'],
    ['/admin/contas', 'clipboard', 'Prestação de Contas', 'Lançamentos e saldo', 'green'],
    ['/admin/noticias', 'news', 'Notícias', 'Criar, editar e excluir', 'gold'],
  ];
  return `<section class="gestao g-dashboard"><div class="g-dashboard-inner">
    <h1>Painel Administrativo</h1><p class="g-dashboard-subtitle">Gerencie o Pelu&Cia</p>
    <h2>Ações Rápidas</h2><div class="g-quick-actions">${actions.map(([path, glyph, title, subtitle, tone]) => `<a class="g-quick-action g-quick-${tone}" href="${path}"><span class="g-quick-icon">${icon(glyph)}</span><span><strong>${title}</strong><small>${subtitle}</small></span></a>`).join('')}</div>
  </div></section>`;
}
