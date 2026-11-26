import { apiUrl } from "../services/api.js";

const ICONE_CADEADO = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

const ICONE_USUARIOS = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const SUBTITULOS = {
  escolha: "Área restrita a administradores e voluntários",
  administrador: "Área restrita a administrador",
  voluntario: "Área restrita a voluntários",
};

function renderFormLogin(tipo) {
  return `
    <form class="login-form" data-tipo="${tipo}" id="formLogin-${tipo}">
      <label for="emailLogin-${tipo}">E-mail</label>
      <input type="email" id="emailLogin-${tipo}" placeholder="seu@email.com" required>

      <label for="senhaLogin-${tipo}">Senha</label>
      <input type="password" id="senhaLogin-${tipo}" placeholder="••••••••" required>

      <div class="login-opcoes">
        <label class="login-lembrar" for="lembrar-${tipo}">
          <input type="checkbox" id="lembrar-${tipo}">
          Lembrar de mim
        </label>
        <button type="button" class="login-esqueci" data-login-esqueci>Esqueci a senha</button>
      </div>

      <button type="submit" class="btn-submit">Entrar</button>
      <p class="admin-feedback login-feedback" id="feedbackLogin-${tipo}" role="status" aria-live="polite"></p>
      <button type="button" class="login-voltar" data-login-view="escolha">← Voltar</button>
    </form>
  `;
}

export function renderLoginPage() {
  return `
    <section class="login-page">
      <div class="login-wrapper">
        <div class="login-topo">
          <img src="/images/logos/logo-ii.png" alt="Logo PeluCIA">
          <h1>PeluCIA</h1>
          <p class="login-subtitulo" id="loginSubtitulo">${SUBTITULOS.escolha}</p>
        </div>

        <div class="login-card">
          <h2 class="login-card-titulo">${ICONE_CADEADO} Entrar</h2>
          <p class="login-card-descricao">Acesse com suas credenciais de administrador ou voluntário</p>

          <div class="login-view" data-view="escolha">
            <button type="button" class="btn-submit login-escolha" data-login-view="administrador">Sou Administrador</button>
            <button type="button" class="btn-submit login-escolha" data-login-view="voluntario">Sou Voluntário</button>
          </div>

          <div class="login-view" data-view="administrador" hidden>
            ${renderFormLogin("administrador")}
          </div>

          <div class="login-view" data-view="voluntario" hidden>
            ${renderFormLogin("voluntario")}
          </div>
        </div>

        <div class="login-aviso" id="loginAviso">
          ${ICONE_USUARIOS}
          <p>
            O acesso é restrito a <strong>administradores</strong> e <strong>voluntários aprovados</strong>.
            Para se tornar voluntário, <a href="/voluntario">preencha o formulário de inscrição</a>.
          </p>
        </div>
      </div>
    </section>
  `;
}

function mostrarView(nome) {
  document.querySelectorAll(".login-view").forEach((view) => {
    view.hidden = view.dataset.view !== nome;
  });

  const subtitulo = document.getElementById("loginSubtitulo");
  const aviso = document.getElementById("loginAviso");

  if (subtitulo) {
    subtitulo.textContent = SUBTITULOS[nome];
  }

  if (aviso) {
    aviso.hidden = nome !== "escolha";
  }
}

async function enviarLogin(form) {
  const tipo = form.dataset.tipo;
  const feedback = document.getElementById(`feedbackLogin-${tipo}`);
  const botaoEnviar = form.querySelector('button[type="submit"]');
  const email = document.getElementById(`emailLogin-${tipo}`).value.trim();
  const senha = document.getElementById(`senhaLogin-${tipo}`).value;
  const lembrar = document.getElementById(`lembrar-${tipo}`)?.checked;

  botaoEnviar.disabled = true;
  feedback.textContent = "Entrando...";
  feedback.className = "admin-feedback login-feedback";

  try {
    const resposta = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
        tipo,
      }),
    });

    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(resultado.message || "Erro ao entrar.");
    }

    if (tipo === "administrador") {
      localStorage.setItem("adminToken", resultado.token);
      if (lembrar) {
        localStorage.setItem(`loginEmail-${tipo}`, email);
      } else {
        localStorage.removeItem(`loginEmail-${tipo}`);
      }
      window.location.href = "/admin";
    } else {
      localStorage.setItem("voluntarioToken", resultado.token);
      if (lembrar) {
        localStorage.setItem(`loginEmail-${tipo}`, email);
      } else {
        localStorage.removeItem(`loginEmail-${tipo}`);
      }
      window.location.href = "/";
    }
  } catch (erro) {
    feedback.textContent = erro.message || "Não foi possível conectar ao servidor.";
    feedback.className = "admin-feedback login-feedback erro";
  } finally {
    botaoEnviar.disabled = false;
  }
}

export function initLoginPage() {
  mostrarView("escolha");

  document.querySelectorAll(".login-form").forEach((form) => {
    const tipo = form.dataset.tipo;
    const email = document.getElementById(`emailLogin-${tipo}`);
    const lembrar = document.getElementById(`lembrar-${tipo}`);
    const emailSalvo = localStorage.getItem(`loginEmail-${tipo}`);

    if (email && emailSalvo) {
      email.value = emailSalvo;
      if (lembrar) {
        lembrar.checked = true;
      }
    }
  });

  document.querySelectorAll("[data-login-view]").forEach((botao) => {
    botao.addEventListener("click", () => mostrarView(botao.dataset.loginView));
  });

  document.querySelectorAll(".login-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      enviarLogin(form);
    });
  });

  document.querySelectorAll(".login-esqueci").forEach((link) => {
    link.addEventListener("click", () => {
      window.location.href = "mailto:pelu.ciaqxd@gmail.com?subject=Recuperação de acesso - PeluCIA";
    });
  });
}