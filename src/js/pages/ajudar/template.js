import { renderPageHeader } from "../../components/titles.js";

export function renderAjudarPage() {
  return `
    ${renderPageHeader({
      title: "Faça a Diferença",
      subtitle:
        "Sua doação ajuda a manter nosso projeto ativo, cuidando de mais animais e salvando vidas.",
    })}

    <section class="card-info">
      <h2>Cuidando dos Animais do Campus</h2>
      <p>
        Os voluntários do PeluCIA cuidam diariamente dos animais que vivem no campus da UFC
        Quixadá. Suas doações garantem ração de qualidade, vacinas, vermifugação e consultas
        veterinárias para todos eles.
      </p>

      <a href="#doacao" class="botao-azul">
        <img src="/images/ajudar/coracao.webp" alt=""> Fazer uma Doação
      </a>
    </section>

    <section class="estatisticas">
      <div class="card-estatistica">
        <img src="/images/ajudar/valor-atual.webp" alt="">
        <h3 id="saldoAtualCaixa">Carregando...</h3>
        <p>Valor atual em caixa</p>
      </div>

      <div class="card-estatistica amarelo">
        <img src="/images/ajudar/transparencia.webp" alt="">
        <h3>100%</h3>
        <p>Transparência nas contas</p>
      </div>
    </section>

    <section class="doacao" id="doacao">
      <input type="radio" name="abas-doacao" id="aba-pix" checked>
      <input type="radio" name="abas-doacao" id="aba-transferencia">
      <input type="radio" name="abas-doacao" id="aba-contas">

      <div class="abas">
        <label for="aba-pix">PIX</label>
        <label for="aba-transferencia">Transferência</label>
        <label for="aba-contas">Prestação de Contas</label>
      </div>

      <div class="conteudos-abas">
        <div class="conteudo conteudo-pix">
          <h2>Doação via PIX</h2>
          <p>Forma mais rápida e prática de ajudar</p>
          <p class="rotulo-pix">Copie a chave pix e doe:</p>
          <div class="chave-pix">Chave PIX não cadastrada.</div>
          <button type="button" class="botao-copiar" id="copiarPixButton">Copiar chave PIX</button>
          <div class="favorecido">Favorecido: PeluCia - UFC Quixadá</div>
        </div>

        <div class="conteudo conteudo-transferencia">
          <div class="icone-titulo" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3 21h18M5 18h14M6 10h12M12 3l8 5H4l8-5Z"/><path d="M7 10v8M12 10v8M17 10v8"/></svg>
          </div>
          <h2>Doação via Transferência Bancária</h2>
          <p>Dados para depósito ou transferência</p>

          <div class="dados-banco">
            <div>
              <span>Banco:</span>
              <strong>Nu Pagamentos S.A. (0260)</strong>
            </div>

            <div>
              <span>Agência:</span>
              <strong>0001</strong>
            </div>

            <div>
              <span>Conta:</span>
              <strong>43847031-5</strong>
            </div>

            <div>
              <span>Instituição:</span>
              <strong>Nu Pagamentos S.A. - Instituição de Pagamento</strong>
            </div>
          </div>

          <div class="dica">
            <span class="dica-icone" aria-hidden="true">💡</span>
            <span><strong>Dica:</strong> Após realizar a transferência, envie o comprovante para nosso e-mail <strong>pelu.ciaqxd@gmail.com</strong> para que possamos registrar sua contribuição.</span>
          </div>
        </div>

        <div class="conteudo conteudo-contas">
          <div class="icone-titulo" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v9h9M12 12l6 6"/></svg>
          </div>
          <h2>Transparência Total</h2>
          <p>Veja como suas doações estão sendo utilizadas</p>

          <div class="resumo-contas-publico" id="resumoContasPublico">
            <p class="contas-status">Carregando movimentações...</p>
          </div>

          <div class="saldo-caixa" id="saldoCaixaDetalhado">
            <h4>Saldo Atual em Caixa</h4>
            <p>Valor disponível para cuidados aos animais</p>
            <h2>Carregando...</h2>
            <small>Aguardando dados do sistema</small>
          </div>

          <h3>Histórico de movimentações</h3>
          <div id="historicoContas">
            <p class="contas-status">Carregando movimentações...</p>
          </div>

          <div class="compromisso">
            <div class="compromisso-titulo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v9h9M12 12l6 6"/></svg>
              <h4>Nosso Compromisso</h4>
            </div>
            <p>
              Mantemos total transparência sobre o uso dos recursos doados. Cada centavo é
              investido no cuidado dos animais do campus, incluindo alimentação, tratamento
              veterinário, medicamentos e deslocamento quando necessário.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="chamada">
      <h2>Cada Doação Salva Vidas</h2>
      <p>
        Não importa o valor, toda contribuição faz a diferença na vida de um animal que precisa de
        ajuda. Juntos, podemos fazer mais!
      </p>
      <a href="/voluntario" class="botao-contorno">Seja Voluntário</a>
    </section>
  `;
}
