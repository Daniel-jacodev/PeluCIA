import { icon } from '../../components/icons.js';
import { pageHeading, state, announceSuccess } from '../../components/managementShell.js';
import { openModal, modalActions, modalFeedback, feedbackSlot } from '../../components/modal.js';
import { escaparHTML as esc, lerFoto } from '../../utils/management.js';
import { adminRequest, usesLocalData, safeImage, localAction } from '../../services/adminApi.js';

const longDate = (value) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));

export function renderNewsManagement() {
  return `<section class="gestao g-news-page"><div class="g-container">
    ${pageHeading('Notícias', 'Gerencie as publicações do Pelu&Cia', `<button class="g-btn g-btn-primary" type="button" data-new-news>${icon('plus')}Nova Notícia</button>`)}
    <div data-news-list class="g-news-list">${state('Carregando notícias…')}</div>
  </div></section>`;
}

export function initNewsManagement() {
  const root = document.querySelector('.g-news-page');
  const list = root.querySelector('[data-news-list]');
  const controller = new AbortController();
  let records = [];

  async function load() {
    list.innerHTML = state('Carregando notícias…');
    try {
      records = await adminRequest('/api/noticias', { signal: controller.signal });
      if (!root.isConnected) return;
      records.sort((a, b) => new Date(b.data) - new Date(a.data));
      list.innerHTML = records.length ? records.map((item) => `<article class="g-news-card">
        <img class="g-news-image" src="${esc(safeImage(item.foto))}" alt="${esc(item.titulo)}">
        <div class="g-news-copy"><div class="g-news-title"><h2>${esc(item.titulo)}</h2><span class="g-category">${esc(item.tipo)}</span></div><p>${esc(item.resumo)}</p><small class="g-news-meta">${icon('calendar')}${longDate(item.data)}<span>por ${esc(item.autor || 'Autoria não informada')}</span></small></div>
        <div class="g-card-actions"><button class="g-btn g-btn-neutral" type="button" data-edit-news="${item.id}">${icon('edit')}Editar</button><button class="g-btn g-btn-danger" type="button" data-delete-news="${item.id}">${icon('trash')}Excluir</button></div>
      </article>`).join('') : state('Nenhuma notícia cadastrada.');
      list.querySelectorAll('img').forEach((img) => img.addEventListener('error', () => { img.src = '/images/noticias/noticia-1.webp'; }, { once: true }));
    } catch (error) {
      if (error.name !== 'AbortError' && root.isConnected) list.innerHTML = state(esc(error.message), { error: true, retry: true });
    }
  }

  function newsModal(item) {
    const editing = Boolean(item);
    const demo = usesLocalData();
    const dialog = openModal({
      title: `${icon('plus')}${editing ? 'Editar Notícia' : 'Nova Notícia'}`,
      description: editing ? 'Confira os dados da publicação.' : 'Preencha os campos para publicar uma nova notícia.',
      className: 'g-news-modal',
      content: `<form class="g-form" data-news-form>
        <label>Título *<input name="titulo" placeholder="Título da notícia" value="${esc(item?.titulo || '')}" maxlength="255" required></label>
        <label>Data *<input name="data" type="date" aria-label="Data da notícia" value="${esc(item?.data?.slice(0, 10) || '')}" required></label>
        <label>Autor *<input name="autor" value="${esc(item?.autor || 'Equipe PeluCIA')}" ${demo ? '' : 'readonly'} required></label>
        <label>URL da imagem<input name="foto" type="url" placeholder="https://..." value="${esc(/^https?:/.test(item?.foto || '') ? item.foto : '')}"><small>Deixe em branco para usar a imagem padrão.</small></label>
        <label>Resumo * <span class="g-label-muted">(exibido na listagem)</span><textarea name="resumo" placeholder="Breve descrição da notícia..." rows="2" required>${esc(item?.resumo || '')}</textarea></label>
        <label>Conteúdo completo * <span class="g-label-muted">(suporta HTML simples)</span><textarea class="g-code-input" name="noticia" placeholder="&lt;p&gt;Texto da notícia...&lt;/p&gt;&#10;&lt;h3&gt;Subtítulo&lt;/h3&gt;&#10;&lt;p&gt;Mais texto...&lt;/p&gt;" rows="3" required>${esc(item?.noticia || '')}</textarea></label>
        ${!demo ? `<details class="g-extra-fields"><summary>Categoria e arquivo de imagem</summary><label>Categoria *<input name="tipo" maxlength="80" value="${esc(item?.tipo || '')}" placeholder="Ex: Evento" required></label><label>Selecionar imagem do dispositivo<input name="arquivo" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label></details>` : ''}
        ${feedbackSlot()}${modalActions(editing ? 'Salvar' : 'Publicar Notícia', { plus: !editing })}
      </form>`,
    });
    const form = dialog.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fields = new FormData(form);
      const file = fields.get('arquivo');
      if (file?.size && (!/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > 3 * 1024 * 1024)) {
        modalFeedback(dialog, 'Selecione PNG, JPEG, WebP ou GIF de até 3 MB.'); return;
      }
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        const data = Object.fromEntries(['titulo', 'data', 'resumo', 'noticia'].map((key) => [key, String(fields.get(key) || '').trim()]));
        data.tipo = demo ? item?.tipo || 'Evento' : String(fields.get('tipo') || '').trim();
        if (Object.values(data).some((value) => !value)) throw new Error('Preencha todos os campos obrigatórios.');
        data.foto = file?.size ? await lerFoto(file) : fields.get('foto') || item?.foto || '/images/noticias/noticia-1.webp';
        if (demo) {
          data.autor = String(fields.get('autor') || '').trim();
          if (!data.autor) throw new Error('Informe o autor da notícia.');
        }
        if (editing) await localAction('news.update', { id: item.id, values: data });
        else await adminRequest('/api/noticias', { method: 'POST', data, signal: controller.signal });
        if (!root.isConnected) return;
        if (dialog.isConnected) dialog.close();
        await load(); announceSuccess(root, editing ? 'Alterações salvas com sucesso!' : 'Notícia publicada com sucesso!');
      } catch (error) { if (error.name !== 'AbortError') modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-new-news]')) newsModal();
    if (event.target.closest('[data-retry]')) load();
    const edit = event.target.closest('[data-edit-news]');
    if (edit) newsModal(records.find((item) => String(item.id) === edit.dataset.editNews));
    const remove = event.target.closest('[data-delete-news]');
    if (!remove) return;
    const item = records.find((record) => String(record.id) === remove.dataset.deleteNews);
    const dialog = openModal({ title: 'Excluir notícia', description: 'Esta ação remove a publicação do site.', content: `<form><p>${esc(item.titulo)}</p>${feedbackSlot()}${modalActions('Excluir')}</form>` });
    dialog.querySelector('form').addEventListener('submit', async (submit) => {
      submit.preventDefault();
      const button = dialog.querySelector('[type="submit"]'); button.disabled = true;
      try {
        await adminRequest(`/api/noticias/${item.id}`, { method: 'DELETE', signal: controller.signal });
        if (root.isConnected) { if (dialog.isConnected) dialog.close(); await load(); announceSuccess(root, 'Notícia excluída com sucesso!'); }
      } catch (error) { if (error.name !== 'AbortError') modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  });
  load();
  return () => controller.abort();
}
