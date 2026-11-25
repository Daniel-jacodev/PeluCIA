// Ícones vetoriais de traço uniforme; não dependem de fontes ou bibliotecas.
const paths = {
  home: '<path d="m3 10 9-7 9 7v11h-6v-8H9v8H3Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  news: '<rect x="5" y="3" width="16" height="18" rx="2"/><path d="M5 7H2v12a2 2 0 0 0 2 2h3M9 7h8M9 11h8M9 15h4M9 18h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  edit: '<path d="m16 3 5 5M3 21l5-1L21 7a2.8 2.8 0 0 0-4-4L4 16Z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  clipboard: '<rect x="5" y="5" width="15" height="17" rx="2"/><rect x="9" y="2" width="7" height="5" rx="1"/><path d="M9 12h1m3 0h4m-8 5h1m3 0h4"/>',
  money: '<path d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  up: '<path d="m3 17 6-6 4 4 8-9m-6 0h6v6"/>',
  down: '<path d="m3 7 6 6 4-4 8 9m-6 0h6v-6"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  check: '<path d="m8 12 3 3L21 4"/><path d="M21 12a9 9 0 1 1-6-8.5"/>',
  denied: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m-6 0 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.7 9.7a16 16 0 0 0 6.6 6.6l1.3-1.3a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2Z"/>',
  chat: '<path d="M21 11.5a9 9 0 0 1-13.4 8L2 21l1.5-5.6A9 9 0 1 1 21 11.5Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  approve: '<circle cx="9" cy="6" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m0-11 3 3 4-5"/>',
};

export function icon(name, className = '') {
  return `<svg class="ui-icon ${className}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.info}</svg>`;
}
