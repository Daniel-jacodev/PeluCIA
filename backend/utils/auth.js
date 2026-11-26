import crypto from 'crypto';

const TOKEN_DURATION = 1000 * 60 * 60 * 8;

function assinar(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function criarTokenAdmin() {
  const dados = {
    tipo: 'admin',
    expiraEm: Date.now() + TOKEN_DURATION,
  };
  const payload = Buffer.from(JSON.stringify(dados)).toString('base64url');
  const assinatura = assinar(payload, process.env.ADMIN_TOKEN_SECRET);

  return `${payload}.${assinatura}`;
}

export function criarTokenVoluntario() {
  const dados = {
    tipo: 'voluntario',
    expiraEm: Date.now() + TOKEN_DURATION,
  };
  const payload = Buffer.from(JSON.stringify(dados)).toString('base64url');
  const assinatura = assinar(payload, process.env.ADMIN_TOKEN_SECRET);

  return `${payload}.${assinatura}`;
}

export function validarTokenAdmin(token) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!token || !secret) {
    return false;
  }

  const [payload, assinatura] = token.split('.');

  if (!payload || !assinatura || assinar(payload, secret) !== assinatura) {
    return false;
  }

  try {
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return dados.tipo === 'admin' && dados.expiraEm > Date.now();
  } catch (erro) {
    return false;
  }
}
