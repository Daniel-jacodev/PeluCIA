import { icon } from '../../components/icons.js';
import { pageHeading, state, announceSuccess } from '../../components/managementShell.js';
import { openContactDialog } from '../../components/contactDialog.js';
import { openModal, modalActions, modalFeedback, feedbackSlot } from '../../components/modal.js';
import { escaparHTML as esc, formatarData as date } from '../../utils/management.js';
import { adminRequest, usesLocalData, whatsappUrl, localAction } from '../../services/adminApi.js';

const statuses = { pendente: 'Pendente', aprovado: 'Aprovado', negado: 'Negado' };
const availability = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite', 'finais-de-semana': 'Fins de Semana', flexivel: 'Horário Flexível' };
const statusOf = (item) => Object.hasOwn(statuses, item.status) ? item.status : 'unknown';
const badge = (item) => statuses[statusOf(item)] ? `<span class="g-badge g-badge-${statusOf(item)}">${statuses[statusOf(item)]}</span>` : '';
const available = (item) => availability[item.disponibilidade] || item.disponibilidade || 'Não informada';
const scheduleText = (item) => (item.horarios || []).map((slot) => `${slot.dia}: ${slot.inicio} às ${slot.fim}`).join('\n');

export function renderVolunteerManagement() {
  return `<section class="gestao g-volunteers-page"><div class="g-container g-container-wide">
    ${pageHeading('Voluntários', 'Gerencie as inscrições de voluntariado')}
    <div class="g-volunteer-stats g-stat-grid" data-volunteer-stats>${state('Carregando resumo…')}</div>
    <div class="g-volunteer-toolbar"><label class="g-search">${icon('search')}<input type="search" placeholder="Buscar por nome" aria-label="Buscar voluntários por nome" data-volunteer-search></label><div class="g-filter-row" role="group" aria-label="Filtrar voluntários">${[['todos', 'Todos'], ['pendente', 'Pendentes'], ['aprovado', 'Aprovados'], ['negado', 'Negados']].map(([value, label]) => `<button class="g-btn ${value === 'todos' ? 'g-btn-primary' : 'g-btn-neutral'}" type="button" data-volunteer-filter="${value}" aria-pressed="${value === 'todos'}">${label}</button>`).join('')}</div></div>
    <div class="g-volunteer-list" data-volunteer-list>${state('Carregando voluntários…')}</div>
  </div></section>`;
}

export function initVolunteerManagement() {
  const root = document.querySelector('.g-volunteers-page');
  const list = root.querySelector('[data-volunteer-list]');
  const summary = root.querySelector('[data-volunteer-stats]');
  const controller = new AbortController();
  let records = [], filter = 'todos', query = '';
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

  function draw() {
    const shown = records.filter((item) => (filter === 'todos' || statusOf(item) === filter) && normalize(item.nome).includes(normalize(query)));
    list.innerHTML = shown.length ? shown.map((item) => {
      const status = statusOf(item), whatsapp = !usesLocalData() && whatsappUrl(item.telefone);
      return `<article class="g-volunteer-card"><div class="g-volunteer-info"><div class="g-volunteer-name"><h2>${esc(item.nome)}</h2>${badge(item)}</div><p>${item.area ? `${esc(item.area)} · ` : ''}Disponibilidade: ${esc(available(item))}</p><small>Inscrito em ${date(item.criado_em)}</small>
        ${status === 'aprovado' ? `<div class="g-assignment"><div>${icon('clock')}<div>Horários:<small>${esc(scheduleText(item) || 'Ainda não informados.').replaceAll('\n', '<br>')}</small></div></div><p>Tarefas: ${esc(item.tarefas || 'Ainda não atribuídas.')}</p></div>` : ''}</div>
        <div class="g-card-actions"><button class="g-btn g-btn-neutral" type="button" data-volunteer-action="details" data-id="${item.id}">Ver detalhes</button>
        ${status === 'pendente' || status === 'unknown' ? `<button class="g-btn g-btn-primary" type="button" data-volunteer-action="approve" data-id="${item.id}">${icon('check')}Aceitar</button><button class="g-btn g-btn-danger" type="button" data-volunteer-action="deny" data-id="${item.id}">${icon('denied')}Negar</button>` : `<button class="g-btn g-btn-remove" type="button" data-volunteer-action="remove" data-id="${item.id}">Remover</button>${status === 'aprovado' ? whatsapp ? `<a class="g-btn g-btn-success" target="_blank" rel="noopener noreferrer" href="${whatsapp}">${icon('chat')}WhatsApp</a>` : `<button class="g-btn g-btn-success" type="button" data-volunteer-action="whatsapp" data-id="${item.id}">${icon('chat')}WhatsApp</button>` : `<button class="g-btn g-btn-primary" type="button" data-volunteer-action="approve" data-id="${item.id}">${icon('approve')}Aprovar mesmo assim</button>`}`}
        </div></article>`;
    }).join('') : state(records.length ? 'Nenhum voluntário corresponde à busca e aos filtros.' : 'Nenhum voluntário cadastrado.');
  }

  async function load() {
    try {
      records = await adminRequest('/api/voluntarios', { signal: controller.signal });
      if (!root.isConnected) return;
      const hasUnknown = records.some((item) => statusOf(item) === 'unknown');
      summary.innerHTML = ['pendente', 'aprovado', 'negado'].map((status, index) => `<article class="g-volunteer-stat g-count-${status}"><strong>${hasUnknown ? '—' : records.filter((item) => statusOf(item) === status).length}</strong><span>${['Pendentes', 'Aprovados', 'Negados'][index]}</span></article>`).join('');
      draw();
    } catch (error) { if (error.name !== 'AbortError' && root.isConnected) { summary.innerHTML = ''; list.innerHTML = state(esc(error.message), { error: true, retry: true }); } }
  }

  function detailsModal(item, approval = false) {
    const approved = statusOf(item) === 'aprovado';
    const scheduling = approval || approved;
    const dialog = openModal({ title: esc(item.nome), description: 'Detalhes da inscrição de voluntariado', className: 'g-volunteer-detail-modal', content: `<form class="g-detail-form">
      <div class="g-status-row"><span>Status da solicitação</span>${badge(item) || '<span>—</span>'}</div>
      <div class="g-detail-block g-detail-columns"><div><span>E-mail</span><p>${esc(item.email)}</p></div><div><span>WhatsApp</span><p>${esc(item.telefone)}</p></div></div>
      <div class="g-detail-block"><span>Disponibilidade</span><p>${esc(available(item))}</p></div>
      ${scheduling ? `<label class="g-detail-label">Selecione os Dias e horários de Voluntariado<textarea name="horarios" rows="4" placeholder="Seg: 07:00 às 08:30&#10;Qua: 07:00 às 08:30&#10;Sex: 07:00 às 09:00">${esc(scheduleText(item))}</textarea></label>${usesLocalData() ? `<details class="g-extra-fields"><summary>Responsabilidades e tarefas</summary><label class="g-detail-label">Tarefas<textarea name="tarefas" rows="3" placeholder="Descreva as responsabilidades">${esc(item.tarefas || '')}</textarea></label></details>` : ''}` : `<div class="g-detail-field"><span>Experiência com animais</span><p>${esc(item.experiencia || 'Não informada.')}</p></div><div class="g-detail-field"><span>Por que quer ser voluntário?</span><p>${esc(item.motivacao || 'Não informado.')}</p></div>`}
      ${feedbackSlot()}${scheduling ? modalActions('Salvar', { cancel: 'Fechar' }) : '<div class="g-modal-actions"><button class="g-btn g-btn-neutral" type="button" data-close-modal>Fechar</button></div>'}
    </form>` });
    dialog.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        await localAction('volunteer.save', { id: item.id, horarios: form.elements.horarios.value, tarefas: form.elements.tarefas?.value || item.tarefas || '' });
        if (!root.isConnected) return;
        if (dialog.isConnected) dialog.close();
        await load();
        announceSuccess(root, approved ? 'Alterações salvas com sucesso!' : 'Voluntário aprovado com sucesso!');
      } catch (error) { modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  }

  root.querySelector('[data-volunteer-search]').addEventListener('input', (event) => { query = event.target.value; draw(); });
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-retry]')) load();
    const filterButton = event.target.closest('[data-volunteer-filter]');
    if (filterButton) {
      filter = filterButton.dataset.volunteerFilter;
      root.querySelectorAll('[data-volunteer-filter]').forEach((button) => { const active = button === filterButton; button.classList.toggle('g-btn-primary', active); button.classList.toggle('g-btn-neutral', !active); button.setAttribute('aria-pressed', String(active)); }); draw();
    }
    const button = event.target.closest('[data-volunteer-action]');
    if (!button) return;
    const item = records.find((record) => String(record.id) === button.dataset.id);
    const action = button.dataset.volunteerAction;
    if (action === 'details' || action === 'approve') { detailsModal(item, action === 'approve'); return; }
    if (action === 'whatsapp') { openContactDialog({ key: `voluntario-${item.id}`, name: item.nome, email: item.email }); return; }
    const title = action === 'deny' ? 'Negar inscrição' : 'Remover voluntário';
    const dialog = openModal({ title, description: esc(item.nome), content: `<form><p>${action === 'deny' ? 'Deseja negar esta inscrição?' : 'Deseja remover este voluntário?'}</p>${feedbackSlot()}${modalActions(action === 'deny' ? 'Negar' : 'Remover')}</form>` });
    dialog.querySelector('form').addEventListener('submit', async (submit) => {
      submit.preventDefault();
      const button = dialog.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        await localAction(action === 'deny' ? 'volunteer.deny' : 'volunteer.remove', { id: item.id });
        if (!root.isConnected) return;
        if (dialog.isConnected) dialog.close();
        await load();
        announceSuccess(root, action === 'deny' ? 'Inscrição negada com sucesso!' : 'Voluntário removido com sucesso!');
      } catch (error) { modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  });
  load();
  return () => controller.abort();
}
