// Utilitários compartilhados pelas interfaces administrativas atuais.
export function escaparHTML(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(Number(valor || 0));
}

export function lerFoto(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject();
    leitor.readAsDataURL(arquivo);
  });
}
