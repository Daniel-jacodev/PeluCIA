const menuItems = [
  {
    href: "/",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></svg>',
    label: "Início",
  },
  {
    href: "/ajudar",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>',
    label: "Ajudar",
  },
  {
    href: "/noticias",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4.5A1.5 1.5 0 0 0 2.5 6v12A2.5 2.5 0 0 0 5 20.5h15a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 20 4.5H4Z"/><rect x="5.5" y="8" width="5" height="6" rx=".5"/><path d="M13.5 8h4M13.5 11h4M13.5 14h4M5.5 17h12"/></svg>',
    label: "Notícias",
  },
  {
    href: "/voluntario",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    label: "Voluntariado",
  },
  {
    href: "/sobre",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    label: "Sobre",
  },
];

function isActiveLink(href) {
  const currentPath = window.location.pathname;

  if ((currentPath === "/" || currentPath === "/index.html") && href === "/") {
    return true;
  }

  return currentPath === href;
}

export function renderHeader() {
  const autenticado = !!(localStorage.getItem("adminToken") || localStorage.getItem("voluntarioToken"));
  const botaoLogin = autenticado
    ? `<button type="button" class="botao-login botao-login-sair" id="botaoLogout">Sair</button>`
    : `<a href="/login" class="botao-login">Entrar</a>`;

  const links = menuItems
    .map((item) => {
      const activeClass = isActiveLink(item.href) ? ' class="ativo"' : "";

      return `
        <a href="${item.href}"${activeClass}>
          ${item.icon}
          ${item.label}
        </a>
      `;
    })
    .join("");

  return `
    <header class="cabecalho">
      <div class="container cabecalho-conteudo">
        <a href="/" class="logo">
          <img src="/images/logos/logo.webp" alt="Logo Pelu&Cia">
        </a>

        <nav class="menu" aria-label="Menu principal">
          ${links}
        </nav>

        ${botaoLogin}
      </div>
    </header>
  `;
}

export function initHeaderEffect() {
  const header = document.querySelector(".cabecalho");

  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("cabecalho-rolado", window.scrollY > 10);
  };

  updateHeader();
  window.onscroll = updateHeader;

  document.getElementById("botaoLogout")?.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("voluntarioToken");
    window.location.href = "/";
  });
}
