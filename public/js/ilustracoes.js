// Ilustrações das amostras, desenhadas em SVG (sem fotos, sem direitos autorais de terceiros).
// Cada tipo de amostra tem uma categoria de cor: vermelho, azul ou verde.
// As linhas usam "currentColor", ou seja, pegam a cor da categoria definida no CSS.
window.ILUSTRACOES = {
  Sangue: {
    categoria: 'vermelho',
    svg: '<svg viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="32" y="6" width="26" height="10" rx="3"/><path d="M35 16 V70 a10 10 0 0 0 20 0 V16"/><path d="M35 38 H55 V70 a10 10 0 0 1 -20 0 Z" fill="currentColor" stroke="none" opacity="0.85"/><line x1="58" y1="28" x2="64" y2="28"/><line x1="58" y1="40" x2="64" y2="40"/><line x1="58" y1="52" x2="64" y2="52"/><line x1="58" y1="64" x2="64" y2="64"/></svg>'
  },
  Soro: {
    categoria: 'vermelho',
    svg: '<svg viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="32" y="6" width="26" height="10" rx="3"/><path d="M35 16 V70 a10 10 0 0 0 20 0 V16"/><path d="M35 30 H55 V58 H35 Z" fill="#e9b949" stroke="none"/><path d="M35 58 H55 V70 a10 10 0 0 1 -20 0 Z" fill="currentColor" stroke="none" opacity="0.85"/><line x1="58" y1="30" x2="64" y2="30"/><line x1="58" y1="44" x2="64" y2="44"/><line x1="58" y1="58" x2="64" y2="58"/></svg>'
  },
  DNA: {
    categoria: 'azul',
    svg: '<svg viewBox="0 0 40 80" fill="none" stroke="currentColor" stroke-linecap="round"><g stroke-width="1.6" opacity="0.55"><line x1="24.3" y1="6.4" x2="15.7" y2="6.4"/><line x1="31.3" y1="11.2" x2="8.7" y2="11.2"/><line x1="34.0" y1="16.0" x2="6.0" y2="16.0"/><line x1="31.3" y1="20.8" x2="8.7" y2="20.8"/><line x1="24.3" y1="25.6" x2="15.7" y2="25.6"/><line x1="15.7" y1="30.4" x2="24.3" y2="30.4"/><line x1="8.7" y1="35.2" x2="31.3" y2="35.2"/><line x1="6.0" y1="40.0" x2="34.0" y2="40.0"/><line x1="8.7" y1="44.8" x2="31.3" y2="44.8"/><line x1="15.7" y1="49.6" x2="24.3" y2="49.6"/><line x1="24.3" y1="54.4" x2="15.7" y2="54.4"/><line x1="31.3" y1="59.2" x2="8.7" y2="59.2"/><line x1="34.0" y1="64.0" x2="6.0" y2="64.0"/><line x1="31.3" y1="68.8" x2="8.7" y2="68.8"/><line x1="24.3" y1="73.6" x2="15.7" y2="73.6"/></g><path stroke-width="3" opacity="0.6" d="M20.0 4.0 L15.7 6.4 L11.8 8.8 L8.7 11.2 L6.7 13.6 L6.0 16.0 L6.7 18.4 L8.7 20.8 L11.8 23.2 L15.7 25.6 L20.0 28.0 L24.3 30.4 L28.2 32.8 L31.3 35.2 L33.3 37.6 L34.0 40.0 L33.3 42.4 L31.3 44.8 L28.2 47.2 L24.3 49.6 L20.0 52.0 L15.7 54.4 L11.8 56.8 L8.7 59.2 L6.7 61.6 L6.0 64.0 L6.7 66.4 L8.7 68.8 L11.8 71.2 L15.7 73.6 L20.0 76.0"/><path stroke-width="3" d="M20.0 4.0 L24.3 6.4 L28.2 8.8 L31.3 11.2 L33.3 13.6 L34.0 16.0 L33.3 18.4 L31.3 20.8 L28.2 23.2 L24.3 25.6 L20.0 28.0 L15.7 30.4 L11.8 32.8 L8.7 35.2 L6.7 37.6 L6.0 40.0 L6.7 42.4 L8.7 44.8 L11.8 47.2 L15.7 49.6 L20.0 52.0 L24.3 54.4 L28.2 56.8 L31.3 59.2 L33.3 61.6 L34.0 64.0 L33.3 66.4 L31.3 68.8 L28.2 71.2 L24.3 73.6 L20.0 76.0"/></svg>'
  },
  RNA: {
    categoria: 'azul',
    svg: '<svg viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 24 C16 10, 26 38, 36 24 S56 10, 66 24 S80 38, 86 26"/><line x1="11" y1="18" x2="11" y2="10"/><line x1="21" y1="25" x2="21" y2="33"/><line x1="31" y1="28" x2="31" y2="36"/><line x1="41" y1="18" x2="41" y2="10"/><line x1="51" y1="15" x2="51" y2="7"/><line x1="61" y1="20" x2="61" y2="12"/><line x1="71" y1="29" x2="71" y2="37"/><line x1="81" y1="31" x2="81" y2="39"/><ellipse cx="42" cy="64" rx="20" ry="10"/><path d="M62 64 L76 55 L76 73 Z"/><line x1="26" y1="61" x2="58" y2="61" stroke-width="1.6"/><line x1="24" y1="64.5" x2="60" y2="64.5" stroke-width="1.6"/><line x1="26" y1="68" x2="58" y2="68" stroke-width="1.6"/><circle cx="29" cy="60" r="1.8" fill="currentColor"/></svg>'
  },
  'Cultura bacteriana': {
    categoria: 'verde',
    svg: '<svg viewBox="3 24 84 42" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><ellipse cx="45" cy="44" rx="38" ry="16"/><path d="M7 44 V54 C7 64, 83 64, 83 54 V44"/><g fill="currentColor" stroke="none"><rect x="26" y="38" width="11" height="5" rx="2.5" transform="rotate(-20 31 40)"/><rect x="42" y="34" width="11" height="5" rx="2.5" transform="rotate(15 47 36)"/><rect x="56" y="42" width="11" height="5" rx="2.5" transform="rotate(-35 61 44)"/><rect x="36" y="46" width="11" height="5" rx="2.5" transform="rotate(30 41 48)"/><circle cx="20" cy="46" r="2.5"/><circle cx="68" cy="38" r="2"/><circle cx="52" cy="50" r="2"/></g></svg>'
  },
  'Cultura de levedura': {
    categoria: 'verde',
    svg: '<svg viewBox="0 0 90 90" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="36" cy="50" r="18"/><circle cx="58" cy="28" r="9"/><circle cx="64" cy="66" r="12"/><circle cx="76" cy="52" r="5"/><g fill="currentColor" stroke="none" opacity="0.55"><circle cx="33" cy="52" r="5"/><circle cx="64" cy="67" r="3.5"/><circle cx="58" cy="28" r="2.5"/></g></svg>'
  }
};

window.ILUSTRACAO_PADRAO = { categoria: 'azul', svg: window.ILUSTRACOES.Sangue.svg };
