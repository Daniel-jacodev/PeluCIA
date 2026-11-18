import { criarTokenAdmin } from '../utils/auth.js';

export function loginAdminController(req, res) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
    return res.status(503).json({ sucesso: false, message: 'Acesso administrativo não configurado.' });
  }

  const { email, senha } = req.body ?? {};
  if (email !== ADMIN_EMAIL || senha !== ADMIN_PASSWORD) {
    return res.status(401).json({ sucesso: false, message: 'E-mail ou senha inválidos.' });
  }

  res.json({
    sucesso: true,
    token: criarTokenAdmin(),
  });
}
