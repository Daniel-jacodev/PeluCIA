import { openModal, modalActions, modalFeedback, feedbackSlot } from './modal.js';
import { escaparHTML as esc } from '../utils/management.js';
import { usesLocalData, localAction } from '../services/adminApi.js';

export async function openContactDialog({ key, name, email }) {
  if (!usesLocalData()) {
    openModal({ title: esc(name), content: `<p>Entre em contato por e-mail:</p><p><a href="mailto:${esc(email)}">${esc(email)}</a></p><div class="g-modal-actions"><button type="button" class="g-btn g-btn-neutral" data-close-modal>Fechar</button></div>` });
    return;
  }
  const history = await localAction('conversation.read', { key });
  const dialog = openModal({ title: esc(name), content: `<div class="g-conversation" role="log" aria-label="Mensagens"></div><form class="g-form"><label>Mensagem<textarea name="mensagem" rows="3" placeholder="Escreva sua mensagem" required></textarea></label>${feedbackSlot()}${modalActions('Enviar', { cancel: 'Fechar' })}</form>` });
  const draw = (items) => {
    const log = dialog.querySelector('.g-conversation');
    log.replaceChildren(...items.map((item) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'g-page-feedback';
      paragraph.textContent = item.mensagem;
      return paragraph;
    }));
  };
  draw(history);
  dialog.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      draw(await localAction('conversation.send', { key, mensagem: form.elements.mensagem.value }));
      form.reset();
      modalFeedback(dialog, 'Mensagem enviada com sucesso!', 'success');
    } catch (error) { modalFeedback(dialog, error.message); }
    finally { button.disabled = false; }
  });
}
