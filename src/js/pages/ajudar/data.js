import { configurarBotaoCopiarPix } from "./actions.js";
import {
  renderizarHistorico,
  renderizarPix,
  renderizarResumo,
  renderizarTransferencia,
  atualizarSaldoDestaque,
} from "./renderers.js";
import { API_CONTAS_URL, API_DOACOES_URL, DOACOES_PADRAO } from "./shared.js";

const CONTAS_EXEMPLO = [
  {
    tipo: "entrada",
    descricao: "Primeiros custos de tratamento",
    valor: 2456.67,
    data: "2026-04-05",
  },
  {
    tipo: "saida",
    descricao: "Clínica veterinária",
    valor: 2332.80,
    data: "2026-04-03",
  },
  {
    tipo: "saida",
    descricao: "Pet shop",
    valor: 123.98,
    data: "2026-04-01",
  },
];

const RESUMO_EXEMPLO = {
  entradas: 800,
  saidas: 593.79,
  saldo: 977.21,
};

function calcularResumo(contas) {
  return contas.reduce(
    (acc, conta) => {
      const valor = Number(conta.valor);

      if (conta.tipo === "entrada") {
        acc.entradas += valor;
      } else {
        acc.saidas += valor;
      }

      acc.saldo = acc.entradas - acc.saidas;
      return acc;
    },
    { entradas: 0, saidas: 0, saldo: 0 }
  );
}

export async function carregarDadosAjudar() {
  const resumoContainer = document.getElementById("resumoContasPublico");
  const historicoContainer = document.getElementById("historicoContas");
  const pixConteudo = document.querySelector(".conteudo-pix");
  const transferenciaConteudo = document.querySelector(".conteudo-transferencia");

  if (!resumoContainer || !historicoContainer || !pixConteudo || !transferenciaConteudo) {
    return;
  }

  pixConteudo.innerHTML = renderizarPix(DOACOES_PADRAO);
  transferenciaConteudo.innerHTML = renderizarTransferencia(DOACOES_PADRAO);
  configurarBotaoCopiarPix();

  try {
    const [respostaContas, respostaDoacoes] = await Promise.all([
      fetch(API_CONTAS_URL),
      fetch(API_DOACOES_URL),
    ]);
    const resultadoContas = await respostaContas.json();
    const resultadoDoacoes = await respostaDoacoes.json();

    if (!respostaContas.ok || !resultadoContas.sucesso) {
      throw new Error(resultadoContas.message || "Erro ao buscar contas.");
    }

    if (!respostaDoacoes.ok || !resultadoDoacoes.sucesso) {
      throw new Error(resultadoDoacoes.message || "Erro ao buscar dados de doação.");
    }

    const contas = resultadoContas.data;
    const doacoes = resultadoDoacoes.data;
    const resumo = calcularResumo(contas);

    pixConteudo.innerHTML = renderizarPix(doacoes);
    configurarBotaoCopiarPix();

    transferenciaConteudo.innerHTML = renderizarTransferencia(doacoes);
    resumoContainer.innerHTML = renderizarResumo(resumo);
    atualizarSaldoDestaque(resumo, contas);

    if (contas.length === 0) {
      resumoContainer.innerHTML = renderizarResumo(RESUMO_EXEMPLO);
      historicoContainer.innerHTML = renderizarHistorico(CONTAS_EXEMPLO);
      return;
    }

    historicoContainer.innerHTML = renderizarHistorico(contas);
  } catch (erro) {
    resumoContainer.innerHTML = renderizarResumo(RESUMO_EXEMPLO);
    historicoContainer.innerHTML = renderizarHistorico(CONTAS_EXEMPLO);
    pixConteudo.innerHTML = renderizarPix(DOACOES_PADRAO);
    configurarBotaoCopiarPix();
    transferenciaConteudo.innerHTML = renderizarTransferencia(DOACOES_PADRAO);
    const saldoTopo = document.getElementById("saldoAtualCaixa");
    if (saldoTopo) {
      saldoTopo.textContent = "Indisponível";
    }
  }
}
