import { escaparHTML, formatarData, formatarMoeda } from "./shared.js";

export function renderizarResumo(resumo) {
  return `
    <div class="card-conta card-resumo-conta saldo">
      <div class="resumo-card-titulo"><span>Saldo Atual</span><span class="resumo-icone">$</span></div>
      <h4>R$ 977,21</h4>
      <small>Atualizado em out/2026</small>
    </div>
    <div class="card-conta card-resumo-conta entradas">
      <div class="resumo-card-titulo"><span>Total de Entradas</span><span class="resumo-icone">↗</span></div>
      <h4>R$ 800,00</h4>
      <small>5 registros</small>
    </div>
    <div class="card-conta card-resumo-conta saidas">
      <div class="resumo-card-titulo"><span>Total de Saídas</span><span class="resumo-icone">↘</span></div>
      <h4>R$ 393,79</h4>
      <small>5 registros</small>
    </div>
  `;
}

export function renderizarHistorico(contas) {
  return `
    <div class="arrecadacao-card">
      <h4>1ª Arrecadação</h4>
      <p>Valor total arrecadado</p>
      <strong class="valor-arrecadado">R$ 2.456,67</strong>
      <p>Utilização:</p>
      <ul>
        <li>Primeiros custos de tratamento</li>
        <li>Ração</li>
        <li>Deslocamento</li>
      </ul>
      <em>Valor praticamente todo utilizado no início do projeto.</em>
    </div>

    <div class="arrecadacao-card">
      <h4>2ª Arrecadação</h4>
      <p>Valor total arrecadado</p>
      <strong class="valor-arrecadado">R$ 3.310,01</strong>
      <p>Gastos até o momento:</p>
      <div class="linha-gasto"><span>• Clínica veterinária:</span><strong>R$ 2.332,80</strong></div>
      <div class="linha-gasto"><span>• Medicamentos, ração e deslocamento:</span><strong>R$ 123,98</strong></div>
      <div class="linha-gasto"><span>• Deslocamento:</span><strong>R$ 1.097,05</strong></div>
      <em>* Parte dos medicamentos também foi destinada a outros animais após o falecimento da Pretinha.</em>
    </div>
  `;
}

export function renderizarPix(doacoes) {
  return `
    <h2>Doação via PIX</h2>
    <p>Forma mais rápida e prática de ajudar</p>
    <p class="rotulo-pix">Copie a chave pix e doe:</p>
    <div class="chave-pix">${escaparHTML(doacoes.pix_chave || "Chave PIX não cadastrada.")}</div>
    <button type="button" class="botao-copiar" id="copiarPixButton" data-pix-key="${escaparHTML(doacoes.pix_chave || "")}">Copiar chave PIX</button>
    <div class="favorecido">Favorecido: ${escaparHTML(doacoes.pix_favorecido || "Não informado")}</div>
  `;
}

export function renderizarTransferencia(doacoes) {
  const observacao = escaparHTML(
    doacoes.observacao_transferencia ||
      "Após realizar a transferência, envie o comprovante para nosso e-mail pelu.ciaqxd@gmail.com para que possamos registrar sua contribuição."
  ).replace(
    "pelu.ciaqxd@gmail.com",
    "<strong>pelu.ciaqxd@gmail.com</strong>"
  );

  return `
    <div class="icone-titulo" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M3 21h18M5 18h14M6 10h12M12 3l8 5H4l8-5Z"/><path d="M7 10v8M12 10v8M17 10v8"/></svg>
    </div>
    <h2>Doação via Transferência Bancária</h2>
    <p>Dados para depósito ou transferência</p>

    <div class="dados-banco">
      <div>
        <span>Banco:</span>
        <strong>${escaparHTML(doacoes.banco || "Não informado")}</strong>
      </div>

      <div>
        <span>Agência:</span>
        <strong>${escaparHTML(doacoes.agencia || "Não informado")}</strong>
      </div>

      <div>
        <span>Conta:</span>
        <strong>${escaparHTML(doacoes.conta || "Não informado")}</strong>
      </div>

      <div>
        <span>Instituição:</span>
        <strong>${escaparHTML(doacoes.instituicao || "Não informado")}</strong>
      </div>
    </div>

    <div class="dica">
      <span class="dica-icone" aria-hidden="true">💡</span>
      <span><strong>Dica:</strong> ${observacao}</span>
    </div>
  `;
}

export function atualizarSaldoDestaque(resumo, contas) {
  const saldoTopo = document.getElementById("saldoAtualCaixa");
  const saldoDetalhado = document.getElementById("saldoCaixaDetalhado");

  if (saldoTopo) {
    saldoTopo.textContent = formatarMoeda(resumo.saldo);
  }

  if (saldoDetalhado) {
    const dataAtualizacao = contas[0]?.data
      ? formatarData(contas[0].data)
      : "sem movimentações cadastradas";

    saldoDetalhado.innerHTML = `
      <h4>Saldo Atual em Caixa</h4>
      <p>Valor disponível para cuidados aos animais</p>
      <h2>${formatarMoeda(resumo.saldo)}</h2>
      <small>Atualizado com base no último lançamento em ${dataAtualizacao}</small>
    `;
  }
}

