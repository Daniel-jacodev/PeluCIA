import { fixtures, profileFixture } from './fixtures.js';

// Apenas dados fictícios do modo local explícito; nunca armazenar respostas da API.
const storageKey = 'pelucia.dev.data.v1';
let records, conversations, sequences;
const personalId = 5;
const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const copy = (value) => structuredClone(value);
const clean = (value) => String(value ?? '').trim();
const fail = () => { throw new Error('Não foi possível concluir a operação. Tente novamente.'); };
const nextId = (key) => sequences[key]++;

function initialState() {
  const data = structuredClone(fixtures);
  Object.assign(data['/api/voluntarios'].find((item) => item.id === personalId), structuredClone(profileFixture));
  return { version: 1, records: data, conversations: {}, sequences: Object.fromEntries(['/api/noticias', '/api/contas', '/api/voluntarios'].map((key) => [key, Math.max(0, ...data[key].map((item) => item.id)) + 1])) };
}

function transaction(operation, mutation) {
  if (!import.meta.env.DEV) return fail();
  let raw, stored;
  try {
    raw = localStorage.getItem(storageKey);
    stored = raw ? JSON.parse(raw) : initialState();
    const keys = ['/api/noticias', '/api/contas', '/api/voluntarios'];
    if (stored.version !== 1 || !stored.conversations || !keys.every((key) => {
      const items = stored.records?.[key], sequence = stored.sequences?.[key];
      return Array.isArray(items) && Number.isSafeInteger(sequence) && sequence > 0 && items.every((item) => Number.isSafeInteger(item.id) && item.id > 0 && item.id < sequence) && new Set(items.map((item) => item.id)).size === items.length;
    })) throw new Error();
  } catch { throw new Error('Não foi possível ler os dados salvos neste navegador.'); }
  records = stored.records;
  conversations = new Map(Object.entries(stored.conversations));
  sequences = stored.sequences;
  const result = operation();
  if (mutation || raw === null) {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, records, conversations: Object.fromEntries(conversations), sequences })); }
    catch { throw new Error('Não foi possível salvar os dados neste navegador. Verifique o espaço disponível e tente novamente.'); }
  }
  return result;
}

export function localRequest(path, options = {}) { return transaction(() => applyRequest(path, options), (options.method || 'GET') !== 'GET'); }
export function localAction(action, data) { return transaction(() => applyAction(action, data), !['profile.read', 'conversation.read'].includes(action)); }

function findVolunteer(id = personalId) {
  const item = records['/api/voluntarios'].find((entry) => entry.id === Number(id));
  if (!item) throw new Error('Cadastro não encontrado.');
  return item;
}

function parseSchedule(value) {
  const lines = clean(value).split('\n').filter((line) => line.trim());
  const used = new Set();
  return lines.map((line) => {
    const match = line.trim().match(/^(Seg|Ter|Qua|Qui|Sex|Sáb|Sab|Dom):\s*([0-2]\d:[0-5]\d)\s*(?:às|as|–|-)\s*([0-2]\d:[0-5]\d)$/i);
    if (!match) throw new Error('Use um horário por linha: Seg: 07:00 às 08:30.');
    const day = days.find((item) => item.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') === match[1].toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''));
    if (used.has(day)) throw new Error('Informe apenas um turno para cada dia.');
    used.add(day);
    if (match[2] >= match[3] || Number(match[3].slice(0, 2)) > 23) throw new Error('O fim deve ser posterior ao início e os horários devem ser válidos.');
    return { dia: day, inicio: match[2], fim: match[3], turno: Number(match[2].slice(0, 2)) < 12 ? 'manha' : Number(match[2].slice(0, 2)) < 18 ? 'tarde' : 'noite' };
  });
}

function applyRequest(path, { method = 'GET', data } = {}) {
  if (!import.meta.env.DEV) return fail();
  if (method === 'GET' && Object.hasOwn(records, path)) {
    const items = copy(records[path]);
    return path === '/api/contas' ? items.sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id) : items;
  }
  if (method === 'POST' && ['/api/noticias', '/api/contas'].includes(path)) {
    if (path === '/api/noticias' && records[path].some((item) => item.titulo === data.titulo)) throw new Error('Título de notícia já cadastrado.');
    const item = { ...copy(data), id: nextId(path), criado_em: new Date().toISOString() };
    if (path === '/api/contas') item.valor = Number(Number(item.valor).toFixed(2));
    records[path].unshift(item);
    return copy(item);
  }
  const deletion = path.match(/^\/api\/(noticias|contas)\/(\d+)$/);
  if (method === 'DELETE' && deletion) {
    const key = `/api/${deletion[1]}`;
    const index = records[key].findIndex((item) => item.id === Number(deletion[2]));
    if (index < 0) throw new Error('Registro não encontrado.');
    records[key].splice(index, 1);
    return null;
  }
  return fail();
}

function applyAction(action, data = {}) {
  if (!import.meta.env.DEV) return fail();
  if (action === 'news.update') {
    const item = records['/api/noticias'].find((entry) => entry.id === Number(data.id));
    if (!item) throw new Error('Notícia não encontrada.');
    if (records['/api/noticias'].some((entry) => entry.id !== item.id && entry.titulo === data.values.titulo)) throw new Error('Título de notícia já cadastrado.');
    Object.assign(item, copy(data.values));
    return copy(item);
  }
  if (action === 'volunteer.save') {
    const item = findVolunteer(data.id);
    const horarios = parseSchedule(data.horarios);
    Object.assign(item, { status: 'aprovado', horarios, tarefas: clean(data.tarefas) });
    return copy(item);
  }
  if (action === 'volunteer.deny') {
    const item = findVolunteer(data.id);
    item.status = 'negado';
    return copy(item);
  }
  if (action === 'volunteer.remove') {
    findVolunteer(data.id);
    records['/api/voluntarios'] = records['/api/voluntarios'].filter((item) => item.id !== Number(data.id));
    return null;
  }
  if (action === 'profile.read') {
    return copy(records['/api/voluntarios'].find((item) => item.id === personalId) || null);
  }
  if (action === 'profile.update') {
    const item = findVolunteer();
    const nome = clean(data.nome), email = clean(data.email), telefone = clean(data.telefone);
    if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telefone.replace(/\D/g, '').length < 10) throw new Error('Confira nome, e-mail e telefone.');
    if (records['/api/voluntarios'].some((entry) => entry.id !== item.id && entry.email.toLowerCase() === email.toLowerCase())) throw new Error('Este e-mail já está cadastrado.');
    Object.assign(item, { nome, email, telefone });
    return copy(item);
  }
  if (action === 'profile.shift') {
    const item = findVolunteer();
    const date = new Date(`${data.data}T12:00:00Z`);
    if (Number.isNaN(date.getTime()) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.inicio) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.fim) || data.inicio >= data.fim) throw new Error('Confira a data e o intervalo de horários.');
    const dia = days[(date.getUTCDay() + 6) % 7];
    item.horarios = (item.horarios || []).filter((slot) => slot.dia !== dia && slot.dia !== data.previousDay);
    item.horarios.push({ dia, data: data.data, turno: data.turno, inicio: data.inicio, fim: data.fim });
    item.horarios.sort((a, b) => days.indexOf(a.dia) - days.indexOf(b.dia));
    return copy(item);
  }
  if (action === 'profile.tasks') {
    const item = findVolunteer();
    item.tarefas = clean(data.tarefas);
    return copy(item);
  }
  if (action === 'conversation.read') return copy(conversations.get(data.key) || []);
  if (action === 'conversation.send') {
    const message = clean(data.mensagem);
    if (!message) throw new Error('Escreva uma mensagem.');
    const history = conversations.get(data.key) || [];
    history.push({ mensagem: message });
    conversations.set(data.key, history);
    return copy(history);
  }
  return fail();
}
