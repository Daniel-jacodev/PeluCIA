import { apiUrl } from './api.js';

export function usesLocalData() { return import.meta.env.DEV && import.meta.env.VITE_LOCAL_DATA === 'true'; }

export async function hasSession(role = 'admin') {
  if (import.meta.env.DEV && usesLocalData()) {
    const { hasLocalSession } = await import('../dev/session.js');
    return hasLocalSession(role);
  }
  return role === 'admin' && Boolean(localStorage.getItem('adminToken'));
}

export async function logout(role = 'admin') {
  if (import.meta.env.DEV && usesLocalData()) {
    const { logoutLocal } = await import('../dev/session.js');
    logoutLocal(role);
  } else if (role === 'admin') localStorage.removeItem('adminToken');
  window.location.href = '/login';
}

export async function adminRequest(path, { method = 'GET', data, signal } = {}) {
  if (usesLocalData()) {
    if (import.meta.env.DEV) {
      if (!await hasSession('admin')) { window.location.replace('/login'); throw new Error('Entre para continuar.'); }
      const { localRequest } = await import('../dev/localStore.js');
      signal?.throwIfAborted();
      return localRequest(path, { method, data });
    }
  }
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.replace('/login');
    throw new Error('Entre com uma conta administrativa.');
  }
  let response;
  try {
    response = await fetch(apiUrl(path), {
      method, signal,
      headers: { Authorization: `Bearer ${token}`, ...(data ? { 'Content-Type': 'application/json' } : {}) },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
  }
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.replace('/login');
    throw new Error('Sua sessão expirou. Entre novamente.');
  }
  if (response.status === 204 && response.ok) return null;
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.sucesso) throw new Error(result?.message || 'Não foi possível concluir a operação.');
  return result.data;
}

// Ações sem contrato HTTP ficam isoladas no modo local explícito.
export async function localAction(action, data) {
  if (import.meta.env.DEV && usesLocalData()) {
    const role = action.startsWith('profile.') ? 'voluntario' : action.startsWith('conversation.') ? null : 'admin';
    const allowed = role ? await hasSession(role) : await hasSession('admin') || await hasSession('voluntario');
    if (!allowed) { window.location.replace('/login'); throw new Error('Entre para continuar.'); }
    const { localAction: execute } = await import('../dev/localStore.js');
    return execute(action, data);
  }
  throw new Error('Não foi possível salvar as alterações. Tente novamente.');
}

export function safeImage(value, fallback = '/images/noticias/noticia-1.webp') {
  const input = String(value || '').trim();
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(input)) return input;
  if (/^\/(?!\/)/.test(input) || /^https?:\/\//i.test(input)) return input;
  return fallback;
}

export function whatsappUrl(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return /^55\d{10,11}$/.test(digits) ? `https://wa.me/${digits}` : null;
}
