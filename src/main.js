import { initHeaderEffect, renderHeader } from './js/components/header.js';
import { renderFooter } from './js/components/footer.js';
import { initAjudarPage, renderAjudarPage } from './js/pages/ajudar.js';
import { initHomePage, renderHomePage } from './js/pages/home.js';
import { initLoginPage, renderLoginPage } from './js/pages/login.js';
import { initNoticiasPage, renderNoticiasPage } from './js/pages/noticias.js';
import { renderSobrePage } from './js/pages/sobre.js';
import { initVoluntarioPage, renderVoluntarioPage } from './js/pages/voluntario.js';
import './css/gestao.css';
import { renderAdminDashboard } from './js/pages/adminDashboard.js';
import { renderNewsManagement, initNewsManagement } from './js/pages/admin/noticias.js';
import { renderFinanceManagement, initFinanceManagement } from './js/pages/admin/contas.js';
import { renderVolunteerManagement, initVolunteerManagement } from './js/pages/admin/voluntarios.js';
import { renderVolunteerArea, initVolunteerArea } from './js/pages/areaVoluntario.js';
import { renderManagementHeader, renderManagementFooter, initManagementHeader } from './js/components/managementShell.js';
import { usesLocalData, hasSession } from './js/services/adminApi.js';
import { closeModal } from './js/components/modal.js';

const routes = {
  '/': {
    render: renderHomePage,
    title: 'Pelu&Cia - Home',
    afterRender: initHomePage,
  },
  '/index.html': {
    render: renderHomePage,
    title: 'Pelu&Cia - Home',
    afterRender: initHomePage,
  },
  '/ajudar': {
    render: renderAjudarPage,
    title: 'Pelu&Cia - Ajudar',
    pageClass: 'pagina-ajudar',
    afterRender: initAjudarPage,
  },
  '/noticias': {
    render: renderNoticiasPage,
    title: 'Pelu&Cia - Notícias',
    afterRender: initNoticiasPage,
  },
  '/sobre': {
    render: renderSobrePage,
    title: 'Pelu&Cia - Sobre',
  },
  '/voluntario': {
    render: renderVoluntarioPage,
    title: 'Pelu&Cia - Voluntariado',
    pageClass: 'voluntariado-page',
    afterRender: initVoluntarioPage,
  },
  '/login': {
    render: renderLoginPage,
    title: 'Pelu&Cia - Login',
    afterRender: initLoginPage,
  },
  '/admin': {
    render: renderAdminDashboard,
    title: 'Pelu&Cia - Painel Administrativo',
    management: true,
    dashboard: true,
  },
  '/admin/noticias': {
    render: renderNewsManagement,
    afterRender: initNewsManagement,
    title: 'Pelu&Cia - Gestão de Notícias',
    management: true,
  },
  '/admin/contas': {
    render: renderFinanceManagement,
    afterRender: initFinanceManagement,
    title: 'Pelu&Cia - Prestação de Contas',
    management: true,
  },
  '/admin/voluntarios': {
    render: renderVolunteerManagement,
    afterRender: initVolunteerManagement,
    title: 'Pelu&Cia - Gestão de Voluntários',
    management: true,
  },
  '/area-voluntario': {
    render: renderVolunteerArea,
    afterRender: initVolunteerArea,
    title: 'Pelu&Cia - Área do Voluntário',
    management: true,
    volunteer: true,
  },
  '/admin-noticias': { redirect: '/admin/noticias' },
};

function mountFooter(route = {}) {
  const footerContainer = document.querySelector('#footer');

  if (footerContainer) {
    footerContainer.innerHTML = route.management ? renderManagementFooter() : renderFooter();
  }
}

function mountHeader(route = {}) {
  const headerContainer = document.querySelector('#header');

  if (headerContainer) {
    headerContainer.innerHTML = route.management ? renderManagementHeader(route) : renderHeader();
    if (route.management) {
      window.onscroll = null;
      initManagementHeader(route);
    } else initHeaderEffect();
  }
}

let disposePage;
let renderVersion = 0;

async function renderRoute() {
  const version = ++renderVersion;
  disposePage?.();
  disposePage = undefined;
  closeModal();
  const app = document.querySelector('#app');

  if (!app) {
    return;
  }

  let pathname = window.location.pathname;
  const redirect = routes[pathname]?.redirect;
  if (redirect) {
    window.history.replaceState({}, '', `${redirect}${window.location.search}${window.location.hash}`);
    pathname = redirect;
  }
  const isAuthenticated = await hasSession('admin');
  const volunteerSession = pathname === '/area-voluntario' && await hasSession('voluntario');
  if (version !== renderVersion) return;

  // Sessões locais são independentes; nenhuma delas autoriza chamadas à API real.
  if (((pathname === '/admin' || pathname.startsWith('/admin/')) && !isAuthenticated) || (pathname === '/area-voluntario' && !volunteerSession)) {
    window.history.replaceState({}, '', '/login');
    const route = routes['/login'];
    app.className = route.pageClass || '';
    app.innerHTML = route.render();
    document.title = route.title;
    mountHeader();
    mountFooter();
    route.afterRender?.();
    return;
  }

  // Se está em /login e já autenticado, redireciona para /admin
  if (pathname === '/login' && isAuthenticated && !usesLocalData()) {
    window.history.replaceState({}, '', '/admin');
    const route = routes['/admin'];
    app.className = route.pageClass || '';
    app.innerHTML = route.render();
    document.title = route.title;
    mountHeader(route);
    mountFooter(route);
    route.afterRender?.();
    return;
  }

  const route = routes[pathname] || routes['/'];

  app.className = route.pageClass || '';
  app.innerHTML = route.render();
  document.title = route.title;
  mountHeader(route);
  mountFooter(route);
  const cleanup = route.afterRender?.();
  if (typeof cleanup === 'function') disposePage = cleanup;

  if (window.location.hash) {
    document.querySelector(window.location.hash)?.scrollIntoView();
  } else {
    window.scrollTo({ top: 0 });
  }
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderRoute();
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');

  if (!link || link.target || link.origin !== window.location.origin || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }

  const path = link.pathname;

  if (!routes[path]) {
    return;
  }

  event.preventDefault();
  navigateTo(`${path}${link.hash}`);
});

window.addEventListener('popstate', renderRoute);

mountHeader();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderRoute();
  });
} else {
  renderRoute();
}
