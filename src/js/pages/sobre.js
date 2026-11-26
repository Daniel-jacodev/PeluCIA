import {
  renderPageHeader,
  renderSectionHeading,
} from "../components/titles.js";

export function renderSobrePage() {
  return `
    ${renderPageHeader({
      title: "Sobre a Pelu&Cia",
      subtitle:
        "Um projeto social da Universidade Federal do Ceará - Campus Quixadá, dedicado ao resgate e adoção responsável de animais desde 2021.",
    })}

    <section class="nossa-historia">
      <div class="container historia-conteudo">
        <div class="historia-texto">
          ${renderSectionHeading({
            title: "Nossa História",
            className: "titulo-secao-esquerda",
          })}

          <p>
            O PeluCIA nasceu dentro do campus UFC Quixadá com o propósito de cuidar dos animais que foram abandonados. Oferecendo carinho, alimento e uma vida mais tranquila. Frequentemente nos deparamos com cães e gatos que chegaram até a UFC sem lar, muitas vezes doentes, com fome ou precisando de atenção.
          </p>

          <p>
            Nossa ação é construída no cuidado contínuo, alimentação, busca de tratamento veterinário, acompanhamento diário e sempre que possível, trabalhamos para encontrar lares responsáveis e cheios de afeto para esses animais.
          </p>

          <p>
            Para nós cada animal cuidado, cada adoção realizada e cada vida transformada reforça o motivo de continuarmos.
          </p>

          <p>
            O campus acaba sendo apenas o ponto de encontro. O verdadeiro objetivo é garantir que esses animais deixem de ser invisíveis e passem a fazer parte de uma família.
          </p>
        </div>

        <div class="historia-imagem">
          <img src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=920&q=80" alt="Gatinho preto resgatado pela Pelu&Cia olhando entre as grades">
        </div>
      </div>
    </section>

    <section class="nosso-impacto">
      <div class="container">
        ${renderSectionHeading({
          title: "Nosso Impacto",
          subtitle:
            "Ao longo do tempo, o PeluCIA vem gerando impactos reais dentro do campus",
        })}

        <div class="impacto-grid">
          <div class="card-impacto">
            <span class="card-icone-circulo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </span>
            <h3>Visibilidade</h3>
            <p>
              Muitos animais, antes ignorados, hoje são reconhecidos, acompanhados e cuidados por mais pessoas graças às nossas ações e divulgações.
            </p>
          </div>

          <div class="card-impacto">
            <span class="card-icone-circulo card-icone-amarelo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            <h3>Mobilização</h3>
            <p>
              Conseguimos mobilizar a comunidade acadêmica para doações constantes de ração, potes e até brinquedos, melhorando a qualidade de vida dos animais.
            </p>
          </div>

          <div class="card-impacto">
            <span class="card-icone-circulo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            </span>
            <h3>Cultura de Cuidado</h3>
            <p>
              Nosso trabalho contribui para criar uma cultura de responsabilidade e empatia dentro do campus, mostrando que esses animais merecem atenção e cuidado contínuo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="faca-parte">
      <div class="container">
        <div class="faca-parte-conteudo">
          <h2>Faça Parte dessa História</h2>
          <p>
            Seja através de uma doação ou voluntariado, você pode fazer a diferença na vida de um animal que precisa de ajuda.
          </p>
          <div class="faca-parte-botoes">
            <a href="/ajudar" class="btn-dourado">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              Fazer uma Doação
            </a>
            <a href="/voluntario" class="btn-contorno-branco">Seja Voluntário</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

