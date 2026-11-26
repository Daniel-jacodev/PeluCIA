import { apiUrl } from "../../services/api.js";

export const API_CONTAS_URL = apiUrl("/api/contas");
export const API_DOACOES_URL = apiUrl("/api/doacoes");

export const DOACOES_PADRAO = {
  pix_chave: "https://nubank.com.br/cobrar/q3s13/69ec760f-8964-4091-bb0f-d95a5a908b7c1",
  pix_favorecido: "PeluCIA - UFC Quixadá",
  banco: "Nu Pagamentos S.A. (0260)",
  agencia: "0001",
  conta: "43847031-5",
  instituicao: "Nu Pagamentos S.A. - Instituição de Pagamento",
  observacao_transferencia:
    "Após realizar a transferência, envie o comprovante para nosso e-mail pelu.ciaqxd@gmail.com para que possamos registrar sua contribuição.",
};

export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

export function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(data));
}

export function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
