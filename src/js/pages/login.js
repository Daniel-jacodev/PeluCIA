import { apiUrl } from "../services/api.js";
import { usesLocalData } from '../services/adminApi.js';

export function renderLoginPage() {
  return `
    <section class="login-page">
      <div class="login-card">
        <img src="/images/logos/logo.webp" alt="Logo Pelu&Cia">
        <h1>Acesse sua conta</h1>
        <p>Entre para acessar seu painel.</p>

        <form id="formLogin">
          <label for="emailLogin">E-mail</label>
          <input type="email" id="emailLogin" required>

          <label for="senhaLogin">Senha</label>
          <input type="password" id="senhaLogin" required>

          <button type="submit" class="btn-submit">Entrar</button>
        </form>

        <p class="admin-feedback" id="feedbackLogin"></p>
      </div>
    </section>
  `;
}

export function initLoginPage() {
  const form = document.getElementById("formLogin");
  const feedback = document.getElementById("feedbackLogin");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    feedback.textContent = "Entrando...";
    feedback.className = "admin-feedback";

    try {
      if (import.meta.env.DEV && usesLocalData()) {
        const { loginLocal } = await import('../dev/session.js');
        const role = loginLocal(document.getElementById('emailLogin').value, document.getElementById('senhaLogin').value);
        window.location.href = role === 'admin' ? '/admin' : '/area-voluntario';
        return;
      }
      const resposta = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.getElementById("emailLogin").value,
          senha: document.getElementById("senhaLogin").value,
        }),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem("adminToken", resultado.token);
        window.location.href = "/admin";
      } else {
        feedback.textContent = resultado.message || "Erro ao entrar.";
        feedback.className = "admin-feedback erro";
      }
    } catch (erro) {
      feedback.textContent = usesLocalData() ? erro.message : "Não foi possível conectar ao servidor.";
      feedback.className = "admin-feedback erro";
    } finally { button.disabled = false; }
  });
}
