import { icon } from '../../components/icons.js';
import { pageHeading, state, announceSuccess } from '../../components/managementShell.js';
import { openModal, modalActions, modalFeedback, feedbackSlot } from '../../components/modal.js';
import { escaparHTML as esc, formatarMoeda as money, formatarData as date } from '../../utils/management.js';
import { adminRequest, usesLocalData } from '../../services/adminApi.js';

export function renderFinanceManagement() {
  return `<section class="gestao g-finance-page"><div class="g-container">
    ${pageHeading('Prestação de Contas', 'Registre entradas e saídas do Pelu&Cia', `<button class="g-btn g-btn-primary" type="button" data-new-entry>${icon('plus')}Novo Lançamento</button>`)}
    <div data-finance-summary class="g-stat-grid">${state('Carregando resumo…')}</div>
    <div class="g-filter-row" role="group" aria-label="Filtrar lançamentos">${[['todos', 'Todos'], ['entrada', 'Entradas'], ['saida', 'Saídas']].map(([value, label]) => `<button type="button" class="g-btn ${value === 'todos' ? 'g-btn-primary' : 'g-btn-neutral'}" data-finance-filter="${value}" aria-pressed="${value === 'todos'}">${label}</button>`).join('')}</div>
    <section class="g-panel g-ledger"><h2>${icon('clipboard')}Lançamentos</h2><p>Histórico de movimentações financeiras</p><div data-finance-list>${state('Carregando lançamentos…')}</div></section>
  </div></section>`;
}

export function initFinanceManagement() {
  const root = document.querySelector('.g-finance-page');
  const list = root.querySelector('[data-finance-list]');
  const summary = root.querySelector('[data-finance-summary]');
  const controller = new AbortController();
  let records = [], filter = 'todos';

  function drawList() {
    const shown = records.filter((record) => filter === 'todos' || record.tipo === filter);
    list.innerHTML = shown.length ? shown.map((item) => `<article class="g-transaction"><span class="g-dot ${item.tipo === 'entrada' ? 'g-dot-green' : 'g-dot-red'}" aria-label="${item.tipo === 'entrada' ? 'Entrada' : 'Saída'}"></span><div class="g-transaction-copy"><h3>${esc(item.descricao)}</h3><small>${date(item.data)}</small>${item.observacoes ? `<em>${esc(item.observacoes)}</em>` : ''}</div><strong class="${item.tipo === 'entrada' ? 'g-text-green' : 'g-text-red'}">${item.tipo === 'entrada' ? '+' : '-'}${money(item.valor)}</strong><button class="g-icon-button" type="button" data-delete-entry="${item.id}" aria-label="Excluir lançamento: ${esc(item.descricao)}">${icon('trash')}</button></article>`).join('') : state(filter === 'todos' ? 'Nenhuma movimentação cadastrada.' : 'Nenhum lançamento neste filtro.');
  }

  async function load() {
    try {
      records = await adminRequest('/api/contas', { signal: controller.signal });
      if (!root.isConnected) return;
      const entries = records.filter((item) => item.tipo === 'entrada'), exits = records.filter((item) => item.tipo === 'saida');
      const sum = (items) => items.reduce((total, item) => total + Number(item.valor), 0);
      const latest = records.reduce((max, item) => item.data > max ? item.data : max, '');
      const updated = latest ? new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(latest)).replace('. de ', '/').replace('.', '') : 'Sem movimentações';
      summary.innerHTML = [
        ['Saldo Atual', sum(entries) - sum(exits), 'money', 'blue', latest ? `Atualizado em ${updated}` : updated],
        ['Total de Entradas', sum(entries), 'up', 'green', `${entries.length} registros`],
        ['Total de Saídas', sum(exits), 'down', 'red', `${exits.length} registros`],
      ].map(([label, value, glyph, tone, caption]) => `<article class="g-stat g-stat-${tone}"><div><span>${label}</span><span class="g-stat-icon">${icon(glyph)}</span></div><strong>${money(value)}</strong><small>${caption}</small></article>`).join('');
      drawList();
    } catch (error) {
      if (error.name !== 'AbortError' && root.isConnected) { summary.innerHTML = ''; list.innerHTML = state(esc(error.message), { error: true, retry: true }); }
    }
  }

  function entryModal() {
    const dialog = openModal({ title: `${icon('plus')}Novo Lançamento`, description: 'Registre uma entrada ou saída financeira do Pelu&Cia.', className: 'g-entry-modal', content: `<form class="g-form">
      <fieldset class="g-entry-type"><legend>Tipo *</legend><div><label><input type="radio" name="tipo" value="entrada" checked><span>Entrada</span></label><label><input type="radio" name="tipo" value="saida"><span>Saída</span></label></div></fieldset>
      <label>Descrição *<input name="descricao" placeholder="Ex: Doação via PIX – Instagram" required></label>
      <div class="g-form-columns"><label>Valor (R$) *<input name="valor" inputmode="decimal" placeholder="0,00" required></label><label>Data *<input name="data" type="date" required></label></div>
      <label>Observações<textarea name="observacoes" rows="2" placeholder="Informações adicionais"></textarea></label>
      ${feedbackSlot()}${modalActions('Adicionar', { plus: true })}</form>` });
    const form = dialog.querySelector('form');
    const amountInput = form.elements.valor;
    amountInput.addEventListener('input', () => amountInput.setCustomValidity(''));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fields = new FormData(form);
      const raw = String(fields.get('valor')).trim();
      const amount = Number(raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw);
      if (!Number.isFinite(amount) || amount <= 0 || amount >= 1e10) { amountInput.setCustomValidity('Informe um valor maior que zero e menor que 10 bilhões.'); amountInput.reportValidity(); return; }
      if (!String(fields.get('descricao')).trim()) { modalFeedback(dialog, 'Informe a descrição do lançamento.'); return; }
      if (!usesLocalData() && String(fields.get('observacoes')).trim()) { modalFeedback(dialog, 'Não foi possível salvar o lançamento. Confira os dados e tente novamente.'); return; }
      const button = form.querySelector('[type="submit"]'); button.disabled = true;
      try {
        const data = { tipo: fields.get('tipo'), descricao: String(fields.get('descricao')).trim(), valor: amount, data: fields.get('data') };
        if (usesLocalData()) data.observacoes = String(fields.get('observacoes')).trim();
        await adminRequest('/api/contas', { method: 'POST', data, signal: controller.signal });
        if (root.isConnected) { if (dialog.isConnected) dialog.close(); await load(); announceSuccess(root, 'Lançamento adicionado com sucesso!'); }
      } catch (error) { if (error.name !== 'AbortError') modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-new-entry]')) entryModal();
    if (event.target.closest('[data-retry]')) load();
    const filterButton = event.target.closest('[data-finance-filter]');
    if (filterButton) {
      filter = filterButton.dataset.financeFilter;
      root.querySelectorAll('[data-finance-filter]').forEach((button) => { const active = button === filterButton; button.classList.toggle('g-btn-primary', active); button.classList.toggle('g-btn-neutral', !active); button.setAttribute('aria-pressed', String(active)); });
      drawList();
    }
    const remove = event.target.closest('[data-delete-entry]');
    if (!remove) return;
    const item = records.find((record) => String(record.id) === remove.dataset.deleteEntry);
    const dialog = openModal({ title: 'Excluir lançamento', description: 'O saldo será recalculado após a exclusão.', content: `<form><p>${esc(item.descricao)} — ${money(item.valor)}</p>${feedbackSlot()}${modalActions('Excluir')}</form>` });
    dialog.querySelector('form').addEventListener('submit', async (submit) => {
      submit.preventDefault(); const button = dialog.querySelector('[type="submit"]'); button.disabled = true;
      try { await adminRequest(`/api/contas/${item.id}`, { method: 'DELETE', signal: controller.signal }); if (root.isConnected) { if (dialog.isConnected) dialog.close(); await load(); announceSuccess(root, 'Lançamento excluído com sucesso!'); } }
      catch (error) { if (error.name !== 'AbortError') modalFeedback(dialog, error.message); }
      finally { button.disabled = false; }
    });
  });
  load();
  return () => controller.abort();
}
