import { criarTokenAdmin, criarTokenVoluntario } from '../utils/auth.js';

export function loginAdminController(req, res) {
  const { email, senha, tipo = 'administrador' } = req.body ?? {};
  const { ADMIN_TOKEN_SECRET } = process.env;

  if (!ADMIN_TOKEN_SECRET) {
    return res.status(503).json({ sucesso: false, message: 'Acesso ao sistema não configurado.' });
  }

  if (tipo === 'administrador') {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(503).json({ sucesso: false, message: 'Acesso administrativo não configurado.' });
    }
    if (email !== ADMIN_EMAIL || senha !== ADMIN_PASSWORD) {
      return res.status(401).json({ sucesso: false, message: 'E-mail ou senha inválidos.' });
    }
    return res.json({ sucesso: true, token: criarTokenAdmin(), tipo: 'administrador' });
  }

  if (tipo === 'voluntario') {
    const { VOLUNTARIO_EMAIL, VOLUNTARIO_PASSWORD } = process.env;
    if (!VOLUNTARIO_EMAIL || !VOLUNTARIO_PASSWORD) {
      return res.status(503).json({
        sucesso: false,
        message: 'Acesso de voluntário não configurado. Solicite suas credenciais à equipe.',
      });
    }
    if (email !== VOLUNTARIO_EMAIL || senha !== VOLUNTARIO_PASSWORD) {
      return res.status(401).json({ sucesso: false, message: 'E-mail ou senha inválidos.' });
    }
    return res.json({ sucesso: true, token: criarTokenVoluntario(), tipo: 'voluntario' });
  }

  return res.status(400).json({ sucesso: false, message: 'Tipo de acesso inválido.' });
}
