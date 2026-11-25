// Contas fictícias exclusivamente locais. Nunca gerar adminToken ou chamar APIs.
const prefix = 'pelucia.dev.session.';
const accounts = [
  { email: 'admin@pelucia.local', password: 'admin123', role: 'admin' },
  { email: 'voluntario@pelucia.local', password: 'voluntario123', role: 'voluntario' },
];

export function hasLocalSession(role) {
  if (!import.meta.env.DEV) return false;
  try {
    const session = JSON.parse(sessionStorage.getItem(prefix + role) || 'null');
    return session?.role === role && session.expiresAt > Date.now();
  } catch { return false; }
}

export function loginLocal(email, password) {
  if (!import.meta.env.DEV) throw new Error('Não foi possível entrar.');
  const account = accounts.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
  if (!account) throw new Error('E-mail ou senha inválidos.');
  try {
    sessionStorage.setItem(prefix + account.role, JSON.stringify({ role: account.role, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }));
  } catch { throw new Error('Não foi possível iniciar a sessão neste navegador.'); }
  return account.role;
}

export function logoutLocal(role) { sessionStorage.removeItem(prefix + role); }
