import { icon } from './icons.js';

let activeDialog;

export function closeModal() {
  activeDialog?.close();
}

export function openModal({ title = '', description = '', content, className = '', closeButton = true }) {
  closeModal();
  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = `g-modal ${className}`;
  dialog.setAttribute('aria-labelledby', 'g-modal-title');
  if (description) dialog.setAttribute('aria-describedby', 'g-modal-description');
  dialog.innerHTML = `${closeButton ? `<button class="g-modal-close" type="button" data-close-modal aria-label="Fechar">${icon('close')}</button>` : ''}
    <header class="g-modal-heading ${title ? '' : 'g-visually-hidden'}"><h2 id="g-modal-title" tabindex="-1">${title || 'Dados do voluntário'}</h2>${description ? `<p id="g-modal-description">${description}</p>` : ''}</header>${content}`;
  document.body.append(dialog);
  activeDialog = dialog;
  document.body.classList.add('g-modal-open');
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], summary, [tabindex="0"]')]
      .filter((element) => element.getClientRects().length && element.getAttribute('aria-hidden') !== 'true');
    const first = focusable[0], last = focusable.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-modal]') || event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.remove();
    if (activeDialog === dialog) {
      activeDialog = null;
      document.body.classList.remove('g-modal-open');
    }
    if (previousFocus?.isConnected) previousFocus.focus();
  }, { once: true });
  dialog.showModal();
  dialog.querySelector('#g-modal-title').focus();
  return dialog;
}

export function modalFeedback(dialog, message, type = 'error') {
  const element = dialog.querySelector('[data-modal-feedback]');
  if (!element) return;
  element.hidden = false;
  element.className = `g-form-feedback g-feedback-${type}`;
  element.textContent = message;
}

export function feedbackSlot() {
  return '<p hidden data-modal-feedback role="status" aria-live="polite"></p>';
}

export function modalActions(label, { plus = false, cancel = 'Cancelar' } = {}) {
  return `<div class="g-modal-actions"><button class="g-btn g-btn-neutral" type="button" data-close-modal>${cancel}</button><button class="g-btn g-btn-primary" type="submit">${plus ? icon('plus') : ''}${label}</button></div>`;
}
