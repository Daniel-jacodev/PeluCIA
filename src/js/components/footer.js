export function renderFooter() {
  return `
    <footer class="rodape">
      <div class="container rodape-conteudo">
        <div class="rodape-sobre">
          <div class="rodape-logo">
            <img src="/images/logos/logofooter.webp" alt="Logo Pelu&Cia">

            <div>
              <h2>PeluCIA</h2>
            </div>
          </div>

          <p>
            Projeto social da UFC Quixadá voltado ao cuidado e ao bem-estar dos animais que residem no campus.
          </p>
        </div>

        <div class="rodape-links">
          <h3>Links Rápidos</h3>

          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/ajudar">Ajudar</a></li>
            <li><a href="/noticias">Notícias</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/voluntario">Voluntariado</a></li>
          </ul>
        </div>

        <div class="rodape-social">
          <h3>Redes Sociais</h3>
          <p>Entre em contato conosco</p>

          <a href="https://instagram.com/pelu.ciaqxd" class="social-item">
            <img src="/icons/instagram.webp" alt="">
            <span>Instagram<br>@pelu.ciaqxd</span>
          </a>

          <a href="mailto:pelu.ciaqxd@gmail.com" class="social-item">
            <img src="/icons/email.webp" alt="">
              
            <span>Email<br>pelu.ciaqxd@gmail.com</span>
          </a>
        </div>
      </div>

      <div class="container rodape-final">
        <p>© 2026 PeluCia - Todos os direitos reservados</p>
        <p>Desenvolvido com amor pela equipe UFC Quixadá</p>
      </div>
    </footer>
  `;
}
