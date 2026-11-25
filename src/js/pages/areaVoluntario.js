import { icon } from '../components/icons.js';
import { announceSuccess } from '../components/managementShell.js';
import { openContactDialog } from '../components/contactDialog.js';
import { openModal, modalActions, modalFeedback, feedbackSlot } from '../components/modal.js';
import { escaparHTML as esc } from '../utils/management.js';
import { usesLocalData, localAction } from '../services/adminApi.js';

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const activeBadge = (profile) => {
  if (!profile) return '';
  const approved = profile.status === 'aprovado';
  return `<span class="g-badge g-badge-${profile.status}">${approved ? icon('check') : ''}${approved ? 'Voluntário ativo' : profile.status === 'negado' ? 'Inscrição negada' : 'Inscrição pendente'}</span>`;
};

function dateForDay(index) {
  const date = new Date();
  date.setDate(date.getDate() - (date.getDay() + 6) % 7 + index);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function renderVolunteerArea() {
  return `<section class="gestao g-personal-page"><div class="g-container g-container-personal"><div class="g-personal-heading"><h1>Meu Painel</h1><p>Área do voluntário - PeluCIA</p></div><div data-personal-content></div></div></section>`;
}

export async function initVolunteerArea() {
  const root = document.querySelector('.g-personal-page');
  let profile = usesLocalData() ? await localAction('profile.read') : null;
  if (!root.isConnected) return;

  function draw() {
    const initials = profile ? profile.nome.split(' ').filter(Boolean).slice(0, 2).map((name) => name[0]).join('') : '—';
    root.querySelector('[data-personal-content]').innerHTML = `
      <section class="g-panel g-profile-card" aria-label="Dados do voluntário"><div class="g-avatar" aria-hidden="true">${esc(initials)}</div><div class="g-profile-copy"><div><h2>${esc(profile?.nome || 'Seu perfil')}</h2>${activeBadge(profile)}</div><p><span>${icon('mail')}${esc(profile?.email || '—')}</span><span>${icon('phone')}${esc(profile?.telefone || '—')}</span></p></div><button class="g-btn g-btn-primary" type="button" data-edit-profile>Editar</button></section>
      <section class="g-panel g-week-panel"><h2>${icon('clock')}Horários de voluntariado</h2><div class="g-week-grid">${days.map((day, index) => { const slot = profile?.horarios?.find((item) => item.dia === day); return `<div class="g-week-day"><h3>${day}</h3><button class="${slot ? 'g-shift' : 'g-add-shift'}" type="button" data-edit-shift="${index}" aria-label="${slot ? 'Editar horário' : 'Adicionar horário'} de ${day}">${slot ? `<strong>${esc(slot.inicio)}</strong><small>às</small><strong>${esc(slot.fim)}</strong>` : icon('plus')}</button></div>`; }).join('')}</div><p class="g-week-note">Turnos confirmados com a equipe. Alterações devem ser combinadas pelo WhatsApp.</p></section>
      <section class="g-panel g-responsibilities"><div class="g-panel-heading"><h2>${icon('clipboard')}Suas responsabilidades</h2>${usesLocalData() ? `<button class="g-icon-button" type="button" data-edit-tasks aria-label="Editar responsabilidades e tarefas">${icon('edit')}</button>` : ''}</div><p>Tarefas atribuídas pela equipe do Pelu&Cia</p><div data-personal-tasks>${esc(profile?.tarefas || 'Nenhuma tarefa atribuída.')}</div></section>
      <section class="g-panel g-help-panel"><h2>${icon('chat')}Precisa de ajuda?</h2><p>Entre em contato com a equipe pelo WhatsApp para tirar dúvidas ou informar sobre alguma situação com o animal.</p><button class="g-btn g-btn-success" type="button" data-contact-team>${icon('chat')}Falar com a equipe Pelu&Cia</button></section>`;
  }

  async function save(dialog, action, data, message, focusSelector) {
    const button = dialog.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const updated = await localAction(action, data);
      if (!root.isConnected) return;
      profile = updated;
      if (dialog.isConnected) dialog.close();
      draw();
      root.querySelector(focusSelector)?.focus();
      announceSuccess(root, message);
    } catch (error) { modalFeedback(dialog, error.message); }
    finally { button.disabled = false; }
  }

  function profileModal() {
    const dialog = openModal({ title: 'Editar perfil do voluntário', closeButton: false, className: 'g-profile-modal g-personal-modal', content: `<form class="g-form">${activeBadge(profile)}
      <label class="g-personal-field">Nome<input name="nome" value="${esc(profile?.nome || '')}" placeholder="Nome completo" required></label>
      <label class="g-personal-field">E-mail<input name="email" type="email" value="${esc(profile?.email || '')}" placeholder="seu@email.com" required></label>
      <label class="g-personal-field">WhatsApp<input name="telefone" type="tel" value="${esc(profile?.telefone || '')}" placeholder="DDD e número" pattern="[0-9+() .-]{10,20}" required></label>
      ${feedbackSlot()}${modalActions('Salvar')}</form>` });
    dialog.querySelector('.g-modal-heading').classList.add('g-visually-hidden');
    dialog.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      save(dialog, 'profile.update', Object.fromEntries(new FormData(event.currentTarget)), 'Perfil atualizado com sucesso!', '[data-edit-profile]');
    });
  }

  function shiftModal(index) {
    const slot = profile?.horarios?.find((item) => item.dia === days[index]);
    const turno = slot?.turno || (slot && slot.inicio >= '18:00' ? 'noite' : slot && slot.inicio >= '12:00' ? 'tarde' : 'manha');
    const dialog = openModal({ title: 'Selecionar horário de voluntariado', closeButton: false, className: 'g-shift-modal g-personal-modal', content: `<form class="g-form">${activeBadge(profile)}
      <label class="g-personal-field">Selecione a data:<input name="data" type="date" value="${esc(slot?.data || dateForDay(index))}" required></label>
      <label class="g-personal-field">Selecione o Turno:<select name="turno" required>${[['manha', 'Manhã'], ['tarde', 'Tarde'], ['noite', 'Noite']].map(([value, name]) => `<option value="${value}" ${value === turno ? 'selected' : ''}>${name}</option>`).join('')}</select></label>
      <div class="g-personal-field g-form-columns"><label>Selecione o Horário de início:<input type="time" name="inicio" value="${esc(slot?.inicio || '09:00')}" required></label><label>Selecione o Horário de fim:<input type="time" name="fim" value="${esc(slot?.fim || '12:00')}" required></label></div>
      ${feedbackSlot()}${modalActions('Salvar')}</form>` });
    dialog.querySelector('.g-modal-heading').classList.add('g-visually-hidden');
    const form = dialog.querySelector('form');
    form.elements.fim.addEventListener('input', () => form.elements.fim.setCustomValidity(''));
    form.elements.inicio.addEventListener('input', () => form.elements.fim.setCustomValidity(''));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (form.elements.fim.value <= form.elements.inicio.value) { form.elements.fim.setCustomValidity('O fim deve ser posterior ao início.'); form.elements.fim.reportValidity(); return; }
      const data = { ...Object.fromEntries(new FormData(form)), previousDay: slot?.dia };
      const newDay = (new Date(`${data.data}T12:00:00Z`).getUTCDay() + 6) % 7;
      save(dialog, 'profile.shift', data, 'Horário salvo com sucesso!', `[data-edit-shift="${newDay}"]`);
    });
  }

  function tasksModal() {
    const dialog = openModal({ title: 'Responsabilidades e tarefas', content: `<form class="g-form"><label>Tarefas<textarea name="tarefas" rows="5" placeholder="Descreva suas responsabilidades">${esc(profile?.tarefas || '')}</textarea></label>${feedbackSlot()}${modalActions('Salvar')}</form>` });
    dialog.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      save(dialog, 'profile.tasks', { tarefas: event.currentTarget.elements.tarefas.value }, 'Alterações salvas com sucesso!', '[data-edit-tasks]');
    });
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-edit-profile]')) profileModal();
    const shift = event.target.closest('[data-edit-shift]');
    if (shift) shiftModal(Number(shift.dataset.editShift));
    if (event.target.closest('[data-edit-tasks]')) tasksModal();
    if (event.target.closest('[data-contact-team]')) openContactDialog({ key: 'equipe', name: 'Equipe Pelu&Cia', email: 'pelu.ciaqxd@gmail.com' });
  });
  draw();
}
