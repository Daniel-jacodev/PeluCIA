import { icon } from './icons.js';
import { logout } from '../services/adminApi.js';

export function renderManagementHeader({ dashboard = false, volunteer = false } = {}) {
  const items = [['/admin', 'home', 'Painel'], ['/admin/noticias', 'news', 'Notícias'], ['/admin/contas', 'clipboard', 'Prestação de Contas'], ['/admin/voluntarios', 'users', 'Voluntários'], ['/area-voluntario', 'clock', 'Meu Painel']];
  return `<header class="gestao-header"><div class="gestao-header-inner">
    <a class="gestao-brand" href="/" aria-label="PeluCIA — início"><img src="/images/logos/logofooter.webp" alt=""><span><strong>PeluCIA</strong><small>UFC Quixadá</small></span></a>
    <button class="gestao-menu-toggle g-btn g-btn-neutral" type="button" aria-expanded="false" aria-controls="gestao-nav" aria-label="Abrir navegação">${icon('menu')}</button>
    <nav id="gestao-nav" class="gestao-nav" aria-label="Menu principal">${items.map(([href, glyph, label]) => `<a href="${href}"${window.location.pathname === href ? ' aria-current="page"' : ''}>${icon(glyph)}${label}</a>`).join('')}</nav>
    <button type="button" class="g-btn g-btn-primary gestao-logout">Sair</button>
  </div></header>`;
}

export function initManagementHeader({ volunteer = false } = {}) {
  const toggle = document.querySelector('.gestao-menu-toggle');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Fechar navegação' : 'Abrir navegação');
  });
  document.querySelector('.gestao-logout')?.addEventListener('click', () => {
    logout(volunteer ? 'voluntario' : 'admin');
  });
}

export function renderManagementFooter() {
  return `<footer class="gestao-footer"><div class="gestao-footer-grid">
    <div><a class="gestao-footer-brand" href="/"><img src="/images/logos/logofooter.webp" alt=""><strong>PeluCIA</strong></a><p>Projeto social da UFC Quixadá voltado ao cuidado e ao<br class="g-desktop-break"> bem-estar dos animais que residem no campus.</p></div>
    <div><h2>Links Rápidos</h2><nav aria-label="Links do rodapé"><a href="/">Início</a><a href="/ajudar">Ajudar</a><a href="/noticias">Notícias</a><a href="/sobre">Sobre</a><a href="/voluntario">Voluntariado</a></nav></div>
    <div><h2>Redes Sociais</h2><p>Entre em contato conosco</p><a class="gestao-social" href="https://instagram.com/pelu.ciaqxd">${icon('instagram')}<span><small>Instagram</small>@pelu.ciaqxd</span></a><a class="gestao-social" href="mailto:pelu.ciaqxd@gmail.com">${icon('mail')}<span><small>Email</small>pelu.ciaqxd@gmail.com</span></a></div>
  </div><div class="gestao-footer-end"><p>© 2026 PeluCIA - Todos os direitos reservados</p><p>Desenvolvido com amor pela equipe UFC Quixadá</p></div></footer>`;
}

export function pageHeading(title, subtitle, action = '') {
  return `<a class="g-back" href="/admin">${icon('back')}Voltar</a><div class="g-page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
}

export function state(message, { error = false, retry = false } = {}) {
  return `<div class="g-state ${error ? 'g-state-error' : ''}" role="status"><p>${message}</p>${retry ? '<button class="g-btn g-btn-neutral" type="button" data-retry>Tentar novamente</button>' : ''}</div>`;
}

export function announceSuccess(root, message) {
  if (!root.isConnected) return;
  root.querySelector('.g-page-feedback')?.remove();
  const feedback = document.createElement('p');
  feedback.className = 'g-page-feedback';
  feedback.setAttribute('role', 'status');
  feedback.textContent = message;
  root.querySelector('.g-page-heading, .g-personal-heading').insertAdjacentElement('afterend', feedback);
}
