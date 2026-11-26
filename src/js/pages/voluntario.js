import { renderPageHeader } from "../components/titles.js";
import { apiUrl } from "../services/api.js";

export function renderVoluntarioPage() {
  return `
    ${renderPageHeader({
      title: "Seja um Voluntário",
      subtitle:
        "Junte-se à nossa equipe e ajude a transformar vidas! Seu tempo e dedicação fazem toda a diferença.",
    })}

    <section class="foto-section">
      <div class="foto-gato">
        <img src="/images/gato.webp" alt="Gato entre animais acolhidos pelo projeto">
      </div>
    </section>

    <section class="inscricao" id="inscricao">
      <div class="container formulario-card">
        <h2>Formulário de Inscrição</h2>
        <p class="formulario-subtitulo">Preencha os dados abaixo para se candidatar como voluntário</p>

        <form id="formVoluntario">
          <div class="linha-form">
            <div class="campo">
              <label for="nome">Nome Completo *</label>
              <input type="text" id="nome" name="nome" required>
            </div>

            <div class="campo">
              <label for="cpf">CPF *</label>
              <input type="text" id="cpf" name="cpf" inputmode="numeric" required>
            </div>
          </div>

          <div class="linha-form">
            <div class="campo">
              <label for="email">E-mail *</label>
              <input type="email" id="email" name="email" required>
            </div>

            <div class="campo">
              <label for="telefone">Telefone *</label>
              <input type="tel" id="telefone" name="telefone" required>
            </div>
          </div>

          <div class="linha-form">
            <div class="campo">
              <label for="idade">Idade *</label>
              <input type="number" id="idade" name="idade" min="16" required>
            </div>

            <div class="campo">
              <label for="profissao">Profissão *</label>
              <input type="text" id="profissao" name="profissao" required>
            </div>
          </div>

          <div class="campo">
            <label for="endereco">Endereço Completo *</label>
            <input type="text" id="endereco" name="endereco" required>
          </div>

          <div class="campo">
            <label for="disponibilidade">Disponibilidade *</label>
            <select id="disponibilidade" name="disponibilidade" required>
              <option value="" selected disabled>Selecione sua disponibilidade: Manhã ou tarde</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="finais-de-semana">Finais de semana</option>
            </select>
          </div>

          <div class="campo">
            <label for="experiencia">Experiência com Animais</label>
            <textarea id="experiencia" name="experiencia" rows="3" placeholder="Conte-nos sobre sua experiência com animais (se houver)"></textarea>
          </div>

          <div class="campo">
            <label for="motivacao">Por que você quer ser voluntário? *</label>
            <textarea id="motivacao" name="motivacao" rows="3" placeholder="Compartilhe sua motivação" required></textarea>
          </div>

          <div class="termos">
            <input type="checkbox" id="termos" name="termos" required>
            <label for="termos">Declaro que as informações fornecidas são verdadeiras e estou ciente que o voluntariado exige comprometimento e responsabilidade.</label>
          </div>

          <button type="submit" class="btn-submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Enviar Inscrição
          </button>
          <p class="feedback-form" id="feedbackVoluntario" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  `;
}

export function initVoluntarioPage() {
  const form = document.getElementById("formVoluntario");
  const feedback = document.getElementById("feedbackVoluntario");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const botaoEnviar = form.querySelector('button[type="submit"]');
    botaoEnviar.disabled = true;

    const dados = {
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpf").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      idade: Number.parseInt(document.getElementById("idade").value, 10),
      profissao: document.getElementById("profissao").value,
      endereco: document.getElementById("endereco").value,
      disponibilidade: document.getElementById("disponibilidade").value,
      experiencia: document.getElementById("experiencia").value,
      motivacao: document.getElementById("motivacao").value,
    };

    feedback.textContent = "Enviando inscrição...";
    feedback.className = "feedback-form";

    try {
      const resposta = await fetch(apiUrl("/api/voluntarios"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.message || "Erro ao cadastrar voluntário.");
      }

      feedback.textContent = "Inscrição enviada com sucesso.";
      feedback.className = "feedback-form feedback-sucesso";
      form.reset();
    } catch (erro) {
      feedback.textContent = erro.message || "Não foi possível conectar ao servidor.";
      feedback.className = "feedback-form feedback-erro";
    } finally {
      botaoEnviar.disabled = false;
    }
  });
}