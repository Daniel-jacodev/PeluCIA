import { renderPageHeader, renderSectionHeading } from "../components/titles.js";
import { apiUrl } from "../services/api.js";
import { noticiasLocais } from "../data/noticias.js";

export function renderNoticiasPage() {
  return `
    ${renderPageHeader({
      title: "Notícias",
      subtitle: "Fique por dentro de tudo que acontece na Pelu&Cia",
    })}

    <section class="noticias-destaque-section">
      <div class="container">
        ${renderSectionHeading({
          title: "Última Notícia",

          className: "titulo-secao titulo-secao-noticias",
        })}

        <div class="noticia-destaque" id="noticiaDestaque">
          <p class="noticias-status">Carregando notícias...</p>
        </div>
      </div>
    </section>

    <section class="noticias-listagem-section">
      <div class="container">
        ${renderSectionHeading({
          title: "Últimas notícias",
          subtitle: "As 8 publicações mais recentes da Pelu&Cia.",
          className: "titulo-secao titulo-secao-noticias",
        })}

        <div class="noticias-grid" id="listaNoticias"></div>
      </div>
    </section>

    <dialog class="noticia-modal" id="noticiaModal">
      <button class="noticia-modal-fechar" type="button" data-fechar-noticia aria-label="Fechar notícia">×</button>
      <div id="noticiaModalConteudo"></div>
    </dialog>
  `;
}

const API_NOTICIAS_URL = apiUrl("/api/noticias");
let noticiasCarregadas = [];

const ICONE_CALENDARIO = `<svg class="icone-meta" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;

const ICONE_USUARIO = `<svg class="icone-meta" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(data));
}

function renderizarDestaque(noticia) {
  return `
    <div class="imagem-destaque">
      <img class="foto-principal" src="${escaparHTML(noticia.foto)}" alt="${escaparHTML(noticia.titulo)}">
    </div>

    <div class="texto-destaque">
      <h2>${escaparHTML(noticia.titulo)}</h2>
      <p class="data destaque-data">
        <span>${ICONE_CALENDARIO} ${formatarData(noticia.data)}</span>
        <span>${ICONE_USUARIO} Equipe Pelu&Cia</span>
      </p>
      <p>${escaparHTML(noticia.resumo)}</p>
      <button class="btn-azul" type="button" data-noticia-id="${noticia.id}">Ler mais</button>
    </div>
  `;
}

function renderizarCard(noticia) {
  return `
    <article class="card-noticia">
      <img src="${escaparHTML(noticia.foto)}" alt="${escaparHTML(noticia.titulo)}">
      <div class="card-texto">
        <h3>${escaparHTML(noticia.titulo)}</h3>
        <p class="data">${ICONE_CALENDARIO} ${formatarData(noticia.data)}</p>
        <p>${escaparHTML(noticia.resumo)}</p>
        <button class="btn-card" type="button" data-noticia-id="${noticia.id}">Ler mais</button>
      </div>
    </article>
  `;
}

function abrirNoticia(id) {
  const noticia = noticiasCarregadas.find((item) => item.id === Number(id));
  const modal = document.querySelector("#noticiaModal");
  const conteudo = document.querySelector("#noticiaModalConteudo");

  if (!noticia || !modal || !conteudo) {
    return;
  }

  conteudo.innerHTML = `
    <img src="${escaparHTML(noticia.foto)}" alt="${escaparHTML(noticia.titulo)}">
    <span class="categoria">${escaparHTML(noticia.tipo)}</span>
    <h2>${escaparHTML(noticia.titulo)}</h2>
    <p class="data">${formatarData(noticia.data)} | Equipe Pelu&Cia</p>
    <p>${escaparHTML(noticia.noticia)}</p>
  `;

  modal.showModal();
}

function preencherNoticias(destaque, lista) {
  const [noticiaPrincipal, ...outrasNoticias] = noticiasCarregadas;
  const ultimasNoticias = outrasNoticias.slice(0, 8);

  destaque.innerHTML = renderizarDestaque(noticiaPrincipal);

  if (ultimasNoticias.length === 0) {
    lista.innerHTML = '<p class="noticias-status">Ainda não existem outras notícias publicadas.</p>';
    return;
  }

  lista.innerHTML = ultimasNoticias.map(renderizarCard).join("");
}

async function carregarNoticias() {
  const destaque = document.querySelector("#noticiaDestaque");
  const lista = document.querySelector("#listaNoticias");

  if (!destaque || !lista) {
    return;
  }

  try {
    const resposta = await fetch(API_NOTICIAS_URL, { signal: AbortSignal.timeout(3000) });
    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.sucesso) {
      throw new Error(resultado.message || "Erro ao buscar notícias.");
    }

    noticiasCarregadas = resultado.data.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (noticiasCarregadas.length === 0) {
      destaque.innerHTML = '<p class="noticias-status">Nenhuma notícia cadastrada.</p>';
      lista.innerHTML = "";
      return;
    }
  } catch (erro) {
    noticiasCarregadas = [...noticiasLocais].sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  }

  preencherNoticias(destaque, lista);
}

export function initNoticiasPage() {
  carregarNoticias();
}

document.addEventListener("click", (event) => {
  const botaoNoticia = event.target.closest("[data-noticia-id]");
  const botaoFechar = event.target.closest("[data-fechar-noticia]");

  if (botaoNoticia) {
    abrirNoticia(botaoNoticia.dataset.noticiaId);
  }

  if (botaoFechar) {
    document.querySelector("#noticiaModal")?.close();
  }
});