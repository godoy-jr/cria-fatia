const TAMANHOS = [
  { id: 'broto', label: 'Broto', fatias: 4, preco: 25, icon: '🍕', desc: '4 pedaços · serve 1 a 2 pessoas' },
  { id: 'medio', label: 'Média', fatias: 6, preco: 35, icon: '🍕', desc: '6 pedaços · serve 2 a 3 pessoas' },
  { id: 'grande', label: 'Grande', fatias: 8, preco: 45, icon: '🍕', desc: '8 pedaços · serve 3 a 4 pessoas' },
];
const MASSAS = [
  { id: 'normal', label: 'Normal', preco: 0, icon: '🥖', desc: 'Massa artesanal tradicional' },
  { id: 'integral', label: 'Integral', preco: 4, icon: '🌾', desc: 'Leve, saborosa e com farinha integral' },
];
const MOLHOS = [
  { id: 'sim', label: 'Com molho', icon: '🍅', desc: 'Molho de tomate da casa' },
  { id: 'nao', label: 'Sem molho', icon: '✨', desc: 'Deixe os outros sabores brilharem' },
];
const RECHEIOS = [
  { id: 'mussarela', label: 'Mussarela', icon: '🧀', group: 'Queijos' },
  { id: 'catupiry', label: 'Catupiry', icon: '🧀', group: 'Queijos' },
  { id: 'queijo-prato', label: 'Queijo prato', icon: '🧀', group: 'Queijos' },
  { id: 'gorgonzola', label: 'Gorgonzola', icon: '🧀', group: 'Queijos' },
  { id: 'calabresa', label: 'Calabresa', icon: '🌶️', group: 'Embutidos' },
  { id: 'frango', label: 'Frango desfiado', icon: '🍗', group: 'Embutidos' },
  { id: 'bacon', label: 'Bacon', icon: '🥓', group: 'Embutidos' },
  { id: 'presunto', label: 'Presunto', icon: '🍖', group: 'Embutidos' },
  { id: 'palmito', label: 'Palmito', icon: '🌱', group: 'Da horta' },
  { id: 'champignon', label: 'Champignon', icon: '🍄', group: 'Da horta' },
  { id: 'milho', label: 'Milho', icon: '🌽', group: 'Da horta' },
  { id: 'cebola', label: 'Cebola roxa', icon: '🧅', group: 'Da horta' },
  { id: 'tomate', label: 'Tomate', icon: '🍅', group: 'Da horta' },
  { id: 'rucula', label: 'Rúcula', icon: '🥬', group: 'Da horta' },
  { id: 'azeitona', label: 'Azeitona', icon: '🫒', group: 'Especiais' },
  { id: 'cream-cheese', label: 'Cream cheese', icon: '🥣', group: 'Especiais' },
];
const SUGESTOES = [
  { id: 'marguerita', label: 'Marguerita', items: ['mussarela', 'tomate', 'rucula', 'azeitona'] },
  { id: 'calabresa-da-casa', label: 'Calabresa da casa', items: ['mussarela', 'calabresa', 'cebola', 'azeitona'] },
  { id: 'caipira', label: 'Caipira cremosa', items: ['frango', 'catupiry', 'milho', 'bacon'] },
];
const MAX_RECHEIOS = 8;
const PARTES_SABOR = 3;
const TAXA_RECHEIO_EXTRA = 3;
const RECHEIOS_INCLUSOS = 4;
const ETAPAS = [
  { id: 'boas-vindas', title: 'Sua pizza começa aqui', subtitle: 'Uma receita em branco e um mundo de combinações.' },
  { id: 'tamanho', title: 'Escolha o tamanho', subtitle: 'Qual tamanho combina com a sua fome de hoje?' },
  { id: 'massa', title: 'Escolha a massa', subtitle: 'A base perfeita para a sua criação.' },
  { id: 'molho', title: 'Vai molho?', subtitle: 'Nosso molho de tomate artesanal ou sem molho?' },
  { id: 'recheios', title: 'Crie seu recheio', subtitle: 'Escolha até 8 ingredientes e personalize a pizza inteira ou cada uma das 3 partes.' },
  { id: 'oregano', title: 'Finaliza com orégano?', subtitle: 'Um toque aromático para fechar sua criação.' },
  { id: 'resumo', title: 'Confira sua criação', subtitle: 'Tudo certo? Confira os detalhes e o valor antes de continuar.' },
  { id: 'checkout', title: 'Onde entregamos?', subtitle: 'Preencha seus dados e escolha como prefere pagar.' },
  { id: 'conclusao', title: 'Pedido confirmado!', subtitle: 'Sua criação está pronta para seguir para a cozinha.' },
];
const ROTULOS_PROGRESSO = ['Tamanho', 'Massa', 'Molho', 'Ingredientes', 'Orégano', 'Resumo', 'Entrega'];
const state = {
  step: 0,
  tamanho: null,
  massa: null,
  molho: null,
  recheios: [],
  modoRecheio: 'inteira',
  fatiaAtiva: 0,
  recheiosPorFatia: {},
  previewMode: 'whole',
  oregano: null,
  pagamento: 'pix',
  troco: '',
  cliente: { nome: '', telefone: '', rua: '', numero: '', bairro: '', complemento: '', cep: '' },
};
const $ = (selector, root = document) => root.querySelector(selector);
const fmt = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

function getRecheioLabel(id) {
  if (id.startsWith('custom:')) return id.slice(7);
  return RECHEIOS.find(item => item.id === id)?.label || id;
}

function getRecheiosAtivos() {
  if (state.modoRecheio === 'fatia') {
    if (!state.recheiosPorFatia[state.fatiaAtiva]) state.recheiosPorFatia[state.fatiaAtiva] = [];
    return state.recheiosPorFatia[state.fatiaAtiva];
  }
  return state.recheios;
}

function hasUniqueTopping(id) {
  const key = getRecheioLabel(id).trim().toLocaleLowerCase('pt-BR');
  return getRecheiosUnicos().some(item => getRecheioLabel(item).trim().toLocaleLowerCase('pt-BR') === key);
}

function getRecheiosUnicos() {
  const items = state.modoRecheio === 'fatia'
    ? Array.from({ length: PARTES_SABOR }, (_, index) => state.recheiosPorFatia[index] || []).flat()
    : state.recheios;
  return [...new Map(items.map(item => [getRecheioLabel(item).trim().toLocaleLowerCase('pt-BR'), item])).values()];
}

function getTotal() {
  if (!state.tamanho) return 0;
  const extras = Math.max(0, getRecheiosUnicos().length - RECHEIOS_INCLUSOS);
  return state.tamanho.preco + (state.massa?.preco || 0) + extras * TAXA_RECHEIO_EXTRA;
}

function buildProgress() {
  const progress = $('#progress');
  progress.innerHTML = ROTULOS_PROGRESSO.map((label, index) =>
    `<li data-progress="${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span>${label}</li>`,
  ).join('');
}

function buildSteps() {
  $('#steps').innerHTML = ETAPAS.map((step, index) => `
    <section class="step" id="step-${index}" aria-labelledby="step-title-${index}">
      <div class="step-head">
        <span class="step-index">${index ? String(index).padStart(2, '0') : '✦'}</span>
        <div>
          <h2 class="step-title" id="step-title-${index}">${step.title}</h2>
          <p class="step-sub">${step.subtitle}</p>
        </div>
      </div>
      <div class="step-body" data-body="${index}"></div>
    </section>`).join('');
}

function optionCard(icon, label, desc, value, selected) {
  return `<button type="button" class="option-card${selected ? ' selected' : ''}" data-select data-value="${value}" aria-pressed="${selected}">
    <span class="option-icon" aria-hidden="true">${icon}</span>
    <span class="option-name">${label}</span>
    <span class="option-desc">${desc}</span>
  </button>`;
}

function renderStep() {
  const index = state.step;
  const body = $(`[data-body="${index}"]`);
  const options = (items, key) => `<div class="options-grid">${items.map(item => {
    const price = item.fatias ? ` · ${fmt(item.preco)}` : item.preco ? ` · + ${fmt(item.preco)}` : '';
    return optionCard(item.icon, item.label, `${item.desc}${price}`, item.id, state[key]?.id === item.id);
  },
  ).join('')}</div>`;
  let content = '';
  switch (ETAPAS[index].id) {
    case 'boas-vindas':
      content = `<div class="welcome-card">
        <span class="welcome-stamp">MASSA ARTESANAL · INGREDIENTES FRESCOS</span>
        <p>Na Bella Roza, quem manda na receita é você. Escolha cada ingrediente, acompanhe a montagem e receba em casa uma pizza com a sua cara.</p>
        <div class="welcome-highlights"><span>✦ Até 8 ingredientes</span><span>✦ Feita na hora</span><span>✦ Do seu jeito</span></div>
        <button class="btn btn-primary welcome-cta" type="button" data-start>Monte sua pizza agora <span aria-hidden="true">→</span></button>
      </div>`;
      break;
    case 'tamanho':
      content = options(TAMANHOS, 'tamanho');
      break;
    case 'massa':
      content = options(MASSAS, 'massa');
      break;
    case 'molho':
      content = options(MOLHOS, 'molho');
      break;
    case 'recheios':
      content = `<div class="counter"><span>INGREDIENTES DIFERENTES NA PIZZA</span><b>${getRecheiosUnicos().length} / ${MAX_RECHEIOS}</b></div>
        <p class="pricing-note">Até ${RECHEIOS_INCLUSOS} ingredientes inclusos · + ${fmt(TAXA_RECHEIO_EXTRA)} por ingrediente adicional</p>
        <div class="filling-mode" role="group" aria-label="Como distribuir os recheios">
          <button type="button" class="mode-button${state.modoRecheio === 'inteira' ? ' selected' : ''}" data-mode="inteira" aria-pressed="${state.modoRecheio === 'inteira'}">🍕 Pizza inteira</button>
          <button type="button" class="mode-button${state.modoRecheio === 'fatia' ? ' selected' : ''}" data-mode="fatia" aria-pressed="${state.modoRecheio === 'fatia'}">◒ Dividir em 3 sabores</button>
        </div>
        ${state.modoRecheio === 'fatia' ? renderSliceSelector() : '<p class="mode-hint">Os recheios escolhidos serão distribuídos em toda a pizza.</p>'}
        <div class="preset-heading"><h3>Ideias para inspirar</h3><span>Toque para usar ou personalize</span></div>
        <div class="preset-grid">${SUGESTOES.map(recipe => `<button type="button" class="preset-card" data-preset="${recipe.id}">
          <strong>${recipe.label}</strong><span>${recipe.items.map(getRecheioLabel).join(' · ')}</span>
        </button>`).join('')}</div>
        ${['Queijos', 'Embutidos', 'Da horta', 'Especiais'].map(group => `<h3 class="topping-group">${group}</h3>
          <div class="toppings-grid">${RECHEIOS.filter(item => item.group === group).map(item => `
            <button type="button" class="topping${getRecheiosAtivos().includes(item.id) ? ' selected' : ''}" data-r="${item.id}" aria-pressed="${getRecheiosAtivos().includes(item.id)}"><span aria-hidden="true">${item.icon}</span>${item.label}</button>`).join('')}
          </div>`).join('')}
        <div class="custom-ingredient">
          <label for="custom-input">Tem uma ideia especial?</label>
          <div class="custom-input-wrap">
            <input type="text" id="custom-input" class="input-text" maxlength="32" placeholder="Ex.: camarão, tomate seco..." autocomplete="off">
            <button type="button" class="btn btn-secondary" id="btn-confirm-custom">Adicionar</button>
          </div>
        </div>
        ${getRecheiosAtivos().length ? `<ul class="selected-list" aria-label="Ingredientes selecionados">${getRecheiosAtivos().map((item, index) => `<li>${escapeHTML(getRecheioLabel(item))}<button type="button" data-remove="${index}" aria-label="Remover ${escapeHTML(getRecheioLabel(item))}">×</button></li>`).join('')}</ul>` : `<p class="empty-selection">${state.modoRecheio === 'fatia' ? `Esta parte ainda está vazia. Você pode repetir um sabor ou inventar uma combinação nova.` : 'Você pode continuar sem recheios ou adicionar até 8 ingredientes.'}</p>`}`;
      break;
    case 'oregano':
      content = `<div class="options-grid">${optionCard('🌿', 'Sim, por favor', 'Orégano fresco por cima', 'sim', state.oregano === 'sim')}${optionCard('✨', 'Sem orégano', 'Deixe assim, está perfeita', 'nao', state.oregano === 'nao')}</div>`;
      break;
    case 'resumo':
      content = renderSummary();
      break;
    case 'checkout':
      content = renderCheckout();
      break;
    case 'conclusao':
      content = renderCompletion();
      break;
  }
  body.innerHTML = content;
  wireStep(index, body);
  refreshNav();
}

function renderSliceSelector() {
  const count = PARTES_SABOR;
  const segments = Array.from({ length: count }, (_, index) => {
    const start = (index * 360 / count) - 90;
    const end = ((index + 1) * 360 / count) - 90;
    const point = angle => ({
      x: (100 + 91 * Math.cos(angle * Math.PI / 180)).toFixed(2),
      y: (100 + 91 * Math.sin(angle * Math.PI / 180)).toFixed(2),
    });
    const first = point(start);
    const last = point(end);
    const middle = (start + end) / 2;
    const labelX = (100 + 57 * Math.cos(middle * Math.PI / 180)).toFixed(2);
    const labelY = (100 + 57 * Math.sin(middle * Math.PI / 180) + 5).toFixed(2);
    const selected = state.fatiaAtiva === index;
    const toppingCount = state.recheiosPorFatia[index]?.length || 0;
    return `<g class="slice-segment${selected ? ' active' : ''}" data-slice="${index}" role="button" tabindex="0" aria-label="Parte ${index + 1}, ${toppingCount} ingrediente${toppingCount === 1 ? '' : 's'}" aria-pressed="${selected}">
      <path d="M 100 100 L ${first.x} ${first.y} A 91 91 0 0 1 ${last.x} ${last.y} Z"></path>
      <text x="${labelX}" y="${labelY}">${index + 1}</text>
    </g>`;
  }).join('');
  return `<div class="slice-builder">
    <p class="mode-hint">Toque em uma das 3 partes e escolha o sabor. Ingredientes iguais contam uma vez no limite e no preço.</p>
    <div class="slice-wheel-wrap"><svg class="slice-wheel" viewBox="0 0 200 200" role="group" aria-label="Escolha uma das 3 partes para personalizar">${segments}</svg></div>
    <p class="active-slice-label">Editando a parte <strong>${state.fatiaAtiva + 1}</strong> de ${count} · ${state.recheiosPorFatia[state.fatiaAtiva]?.length || 0} ingrediente(s)</p>
  </div>`;
}

function renderSummary() {
  const uniqueToppings = getRecheiosUnicos();
  const toppings = state.modoRecheio === 'fatia'
    ? 'Montagem personalizada em 3 partes'
    : uniqueToppings.length ? uniqueToppings.map(getRecheioLabel).join(', ') : 'Sem recheios adicionais';
  const extras = Math.max(0, uniqueToppings.length - RECHEIOS_INCLUSOS);
  const perSliceRows = state.modoRecheio === 'fatia'
    ? Array.from({ length: PARTES_SABOR }, (_, index) => {
      const fillings = state.recheiosPorFatia[index] || [];
      return summaryRow(`Parte ${index + 1}`, fillings.length ? fillings.map(getRecheioLabel).join(', ') : 'Sem recheios', '');
    }).join('')
    : '';
  return `<div class="summary-card">
    <div class="summary-intro"><span class="summary-icon">🍕</span><div><strong>${state.tamanho.label} artesanal</strong><small>${state.tamanho.fatias} pedaços · feita do seu jeito</small></div></div>
    ${summaryRow('Tamanho', `${state.tamanho.label} · ${state.tamanho.fatias} pedaços`, fmt(state.tamanho.preco))}
    ${summaryRow('Massa', state.massa.label, state.massa.preco ? fmt(state.massa.preco) : 'Inclusa')}
    ${summaryRow('Molho', state.molho.id === 'sim' ? 'Molho artesanal' : 'Sem molho', 'Incluso')}
    ${summaryRow('Ingredientes', toppings, extras ? `${extras} × ${fmt(TAXA_RECHEIO_EXTRA)}` : 'Inclusos')}
    ${perSliceRows ? `<div class="slice-summary"><h3>Sabores por parte (3 partes)</h3>${perSliceRows}</div>` : ''}
    ${summaryRow('Orégano', state.oregano === 'sim' ? 'Com orégano' : 'Sem orégano', 'Incluso')}
    <div class="total-row"><span>Total da pizza</span><strong>${fmt(getTotal())}</strong></div>
    <p class="summary-disclaimer">O valor não inclui taxa de entrega. Ela será informada no atendimento.</p>
  </div>`;
}

function summaryRow(label, value, price) {
  return `<div class="summary-row"><span>${label}</span><span>${escapeHTML(value)}</span><b>${price}</b></div>`;
}

function renderCheckout() {
  return `<form class="checkout-form" id="checkout-form" novalidate>
    <fieldset class="payment-options"><legend>Forma de pagamento</legend>
      ${[
        ['pix', '◇', 'PIX', 'Pagamento no recebimento'],
        ['cartao', '▤', 'Cartão', 'Crédito ou débito'],
        ['dinheiro', '$', 'Dinheiro', 'Pagamento na entrega'],
      ].map(([value, icon, label, hint]) => `<label class="payment-card${state.pagamento === value ? ' selected' : ''}">
        <input type="radio" name="pagamento" value="${value}"${state.pagamento === value ? ' checked' : ''}>
        <span class="payment-icon" aria-hidden="true">${icon}</span><span><b>${label}</b><small>${hint}</small></span>
      </label>`).join('')}
    </fieldset>
    <div class="field-group" id="troco-group" ${state.pagamento === 'dinheiro' ? '' : 'hidden'}>
      <label for="troco">Precisa de troco para quanto? <span>(opcional)</span></label>
      <input class="input-text" type="number" id="troco" min="0" step="0.01" inputmode="decimal" placeholder="Ex.: 100,00" value="${escapeHTML(state.troco)}">
    </div>
    <fieldset class="address-fields"><legend>Seus dados para entrega</legend>
      <div class="form-grid">
        ${field('nome', 'Seu nome', 'text', 'autocomplete="name" required')}
        ${field('telefone', 'Celular / WhatsApp', 'tel', 'autocomplete="tel" inputmode="tel" required placeholder="(11) 99999-9999"')}
        ${field('cep', 'CEP', 'text', 'autocomplete="postal-code" inputmode="numeric" required placeholder="00000-000"')}
        ${field('rua', 'Rua / Avenida', 'text', 'autocomplete="address-line1" required')}
        ${field('numero', 'Número', 'text', 'autocomplete="off" required')}
        ${field('bairro', 'Bairro', 'text', 'autocomplete="address-level3" required')}
        ${field('complemento', 'Complemento', 'text', 'autocomplete="address-line2" class="input-text" optional', true)}
      </div>
    </fieldset>
    <p class="checkout-note">Este projeto é uma demonstração acadêmica: os dados não são enviados a um servidor nem armazenados.</p>
  </form>`;
}

function field(id, label, type, attributes, wide = false) {
  const customerValue = state.cliente[id] || '';
  const extraClass = wide ? ' field-wide' : '';
  const cleanedAttributes = attributes.replace(' class="input-text"', '');
  return `<div class="field${extraClass}"><label for="${id}">${label}${id === 'complemento' ? ' <span>(opcional)</span>' : ''}</label>
    <input class="input-text" id="${id}" name="${id}" type="${type}" ${cleanedAttributes} value="${escapeHTML(customerValue)}"></div>`;
}

function renderCompletion() {
  const address = [state.cliente.rua, state.cliente.numero, state.cliente.bairro, state.cliente.complemento].filter(Boolean).join(', ');
  const sliceFlavors = state.modoRecheio === 'fatia'
    ? `<div><span>Sabores por parte</span><b>${Array.from({ length: PARTES_SABOR }, (_, index) => {
      const toppings = state.recheiosPorFatia[index] || [];
      return `Parte ${index + 1}: ${escapeHTML(toppings.length ? toppings.map(getRecheioLabel).join(', ') : 'sem recheios')}`;
    }).join(' · ')}</b></div>`
    : '';
  return `<div class="completion-card">
    <div class="success-mark" aria-hidden="true">✓</div>
    <p class="completion-kicker">OBRIGADO, ${escapeHTML(state.cliente.nome.split(' ')[0] || 'PIZZA LOVER')}!</p>
    <h3>Sua pizza está a caminho da cozinha.</h3>
    <p>Pedido montado com carinho pela Bella Roza Pizzaria.</p>
    <div class="completion-details">
      <div><span>Sua pizza</span><b>${state.tamanho.label} · ${state.tamanho.fatias} pedaços</b></div>
      <div><span>Pagamento</span><b>${paymentLabel()}</b></div>
      <div><span>Entrega</span><b>${escapeHTML(address)} · CEP ${escapeHTML(state.cliente.cep)}</b></div>
      ${sliceFlavors}
      <div><span>Total da pizza</span><b>${fmt(getTotal())}</b></div>
    </div>
    <p class="demo-note">Demonstração acadêmica: este pedido foi registrado apenas nesta tela e não foi transmitido à cozinha.</p>
    <a class="btn btn-primary google-review" href="https://www.google.com/search?q=Bella+Roza+Pizzaria+avaliar" target="_blank" rel="noopener noreferrer">Avalie nossa pizzaria no Google ↗</a>
    <button class="btn btn-ghost restart-button" type="button" data-restart>Fazer outro pedido</button>
  </div>`;
}

function paymentLabel() {
  const names = { pix: 'PIX', cartao: 'Cartão (crédito/débito)', dinheiro: 'Dinheiro' };
  return `${names[state.pagamento]}${state.pagamento === 'dinheiro' && state.troco ? ` · troco para ${fmt(Number(state.troco))}` : ''}`;
}

function wireStep(index, body) {
  body.querySelectorAll('[data-select]').forEach(card => card.addEventListener('click', () => {
    const value = card.dataset.value;
    const stepId = ETAPAS[index].id;
    state[stepId] = stepId === 'tamanho' ? TAMANHOS.find(item => item.id === value)
      : stepId === 'massa' ? MASSAS.find(item => item.id === value)
        : stepId === 'molho' ? MOLHOS.find(item => item.id === value) : value;
    renderStep();
  }));
  body.querySelectorAll('[data-r]').forEach(button => button.addEventListener('click', () => toggleTopping(button.dataset.r)));
  body.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    state.modoRecheio = button.dataset.mode;
    renderStep();
  }));
  body.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => applyPreset(button.dataset.preset)));
  body.querySelectorAll('[data-slice]').forEach(segment => {
    const selectSlice = () => {
      state.fatiaAtiva = Number(segment.dataset.slice);
      renderStep();
    };
    segment.addEventListener('click', selectSlice);
    segment.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSlice();
      }
    });
  });
  body.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
    getRecheiosAtivos().splice(Number(button.dataset.remove), 1);
    renderStep();
  }));
  $('#btn-confirm-custom', body)?.addEventListener('click', addCustomTopping);
  $('#custom-input', body)?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCustomTopping();
    }
  });
  body.querySelectorAll('[name="pagamento"]').forEach(input => input.addEventListener('change', () => {
    state.pagamento = input.value;
    renderStep();
  }));
  $('#troco', body)?.addEventListener('input', event => {
    state.troco = event.target.value;
    event.target.setCustomValidity('');
    refreshNav();
  });
  $('#checkout-form', body)?.addEventListener('input', event => {
    const target = event.target;
    if (target.name && target.name in state.cliente) {
      if (target.name === 'telefone') target.value = formatPhone(target.value);
      if (target.name === 'cep') target.value = formatCep(target.value);
      state.cliente[target.name] = target.value;
      refreshNav();
    }
  });
  $('#checkout-form', body)?.addEventListener('submit', event => event.preventDefault());
  $('[data-start]', body)?.addEventListener('click', () => goTo(1));
  $('[data-restart]', body)?.addEventListener('click', restart);
}

function toggleTopping(id) {
  const active = getRecheiosAtivos();
  const existing = active.indexOf(id);
  if (existing >= 0) active.splice(existing, 1);
  else if (!hasUniqueTopping(id) && getRecheiosUnicos().length >= MAX_RECHEIOS) {
    showToast(`Você já escolheu os ${MAX_RECHEIOS} ingredientes diferentes.`);
    return;
  } else active.push(id);
  renderStep();
}

function applyPreset(id) {
  const recipe = SUGESTOES.find(item => item.id === id);
  if (!recipe) return;
  const otherSlices = state.modoRecheio === 'fatia'
    ? Array.from({ length: PARTES_SABOR }, (_, index) => index === state.fatiaAtiva ? [] : state.recheiosPorFatia[index] || []).flat()
    : [];
  const combined = [...otherSlices, ...recipe.items];
  const uniqueCount = new Set(combined.map(item => getRecheioLabel(item).trim().toLocaleLowerCase('pt-BR'))).size;
  if (uniqueCount > MAX_RECHEIOS) {
    showToast('Essa sugestão ultrapassaria o limite de ingredientes diferentes da pizza.');
    return;
  }
  if (state.modoRecheio === 'fatia') state.recheiosPorFatia[state.fatiaAtiva] = [...recipe.items];
  else state.recheios = [...recipe.items];
  renderStep();
}

function addCustomTopping() {
  const input = $('#custom-input');
  const name = input.value.trim();
  if (!name) {
    showToast('Digite o nome do ingrediente.');
    input.focus();
    return;
  }
  const customId = `custom:${name}`;
  const active = getRecheiosAtivos();
  if (active.some(item => getRecheioLabel(item).toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
    showToast('Esse ingrediente já está na sua pizza.');
    return;
  }
  if (!hasUniqueTopping(customId) && getRecheiosUnicos().length >= MAX_RECHEIOS) {
    showToast(`Você já escolheu os ${MAX_RECHEIOS} ingredientes diferentes.`);
    return;
  }
  active.push(customId);
  renderStep();
}

function validate() {
  switch (ETAPAS[state.step].id) {
    case 'boas-vindas': return true;
    case 'tamanho': return !!state.tamanho;
    case 'massa': return !!state.massa;
    case 'molho': return !!state.molho;
    case 'recheios': return getRecheiosUnicos().length <= MAX_RECHEIOS;
    case 'oregano': return state.oregano === 'sim' || state.oregano === 'nao';
    case 'resumo': return true;
    case 'checkout': return checkoutIsComplete();
    default: return false;
  }
}

function checkoutIsComplete() {
  const form = $('#checkout-form');
  if (!form) return false;
  const requiredFieldsFilled = [...form.querySelectorAll('[required]')].every(input => input.value.trim());
  const phoneValid = ($('#telefone')?.value.replace(/\D/g, '').length || 0) >= 10;
  const cepValid = ($('#cep')?.value.replace(/\D/g, '').length || 0) === 8;
  const change = Number($('#troco')?.value || 0);
  const changeValid = state.pagamento !== 'dinheiro' || !state.troco || change >= getTotal();
  return requiredFieldsFilled && phoneValid && cepValid && changeValid;
}

function validateCheckout() {
  const form = $('#checkout-form');
  const firstEmpty = [...form.querySelectorAll('[required]')].find(input => !input.value.trim());
  if (firstEmpty) {
    firstEmpty.setCustomValidity('Preencha este campo para continuar.');
    firstEmpty.reportValidity();
    firstEmpty.addEventListener('input', () => firstEmpty.setCustomValidity(''), { once: true });
    firstEmpty.focus();
    return false;
  }
  const phone = $('#telefone');
  if (phone.value.replace(/\D/g, '').length < 10) {
    phone.setCustomValidity('Informe um telefone válido com DDD.');
    phone.reportValidity();
    phone.focus();
    return false;
  }
  const cep = $('#cep');
  if (cep.value.replace(/\D/g, '').length !== 8) {
    cep.setCustomValidity('O CEP deve ter 8 números.');
    cep.reportValidity();
    cep.focus();
    return false;
  }
  if (state.pagamento === 'dinheiro' && state.troco && Number(state.troco) < getTotal()) {
    const change = $('#troco');
    change.setCustomValidity(`O troco deve ser para pelo menos ${fmt(getTotal())}.`);
    change.reportValidity();
    change.focus();
    return false;
  }
  return true;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  const splitAt = digits.length === 11 ? 7 : 6;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, splitAt)}-${digits.slice(splitAt)}`;
}

function formatCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function toppingArt(id) {
  const art = {
    mussarela: '<path class="topping-cheese-piece" d="M5 9 Q7 5 13 7 L21 8 Q24 11 21 16 L16 22 Q10 23 7 19 L4 14Z"/><circle class="topping-toast" cx="10" cy="12" r="1.4"/><circle class="topping-toast" cx="18" cy="16" r="1"/>',
    catupiry: '<path class="topping-creamy" d="M5 8 Q8 5 11 8 Q14 4 17 8 Q22 7 22 12 Q25 16 20 17 Q18 22 14 19 Q10 23 8 18 Q3 18 5 14 Q2 10 5 8Z"/>',
    'queijo-prato': '<path class="topping-cheese-piece" d="M5 8 Q13 5 21 8 L20 17 Q14 21 7 17Z"/><circle class="topping-toast" cx="10" cy="12" r="1.1"/><circle class="topping-toast" cx="17" cy="15" r="1.3"/>',
    gorgonzola: '<path class="topping-cheese-piece" d="M5 8 Q13 5 21 9 L19 18 Q12 22 6 17Z"/><path class="topping-mold" d="M9 9l2 2-2 2m6 1 2-2 2 1m-8 4 2-1"/>',
    calabresa: '<ellipse class="topping-sausage-shadow" cx="13" cy="14" rx="9" ry="7"/><ellipse class="topping-sausage" cx="12" cy="12" rx="8" ry="6.5"/><circle class="topping-toast" cx="9" cy="10" r="1.1"/><circle class="topping-toast" cx="15" cy="13" r="1.2"/><circle class="topping-toast" cx="11" cy="15" r=".8"/>',
    frango: '<path class="topping-chicken" d="M4 11 Q8 7 12 10 Q15 6 19 9 L22 12 Q18 15 15 13 Q11 18 7 15 L4 16Z"/><path class="topping-chicken-line" d="M7 11l5 2m2-3 4 2m-9 3 3-2"/>',
    bacon: '<path class="topping-bacon" d="M5 7 Q8 5 10 9 T15 10 T21 7 L22 11 Q18 15 15 12 T10 12 T5 16Z"/><path class="topping-bacon-fat" d="M7 8l2 2m5 1 2 2m3-5 1 2"/>',
    presunto: '<path class="topping-ham" d="M5 9 Q8 5 13 8 Q18 5 21 10 L19 17 Q15 20 11 17 Q7 20 5 15Z"/><path class="topping-ham-light" d="M9 9q3 2 5 0t4 2m-9 5q3-2 6 0"/>',
    palmito: '<ellipse class="topping-palm" cx="13" cy="13" rx="8" ry="6"/><ellipse class="topping-palm-center" cx="13" cy="13" rx="3.5" ry="2.2"/><ellipse class="topping-palm-inner" cx="13" cy="13" rx="1.4" ry="1"/>',
    champignon: '<path class="topping-mushroom" d="M4 12 Q5 6 12 6 Q20 6 22 12 Q21 15 17 14 L16 20 Q12 22 9 20 L8 14 Q4 15 4 12Z"/><path class="topping-mushroom-line" d="M9 15l1 4m5-4-1 4"/>',
    milho: '<ellipse class="topping-corn" cx="9" cy="9" rx="2.4" ry="3"/><ellipse class="topping-corn" cx="15" cy="8" rx="2.4" ry="3"/><ellipse class="topping-corn" cx="19" cy="12" rx="2.4" ry="3"/><ellipse class="topping-corn" cx="14" cy="14" rx="2.4" ry="3"/><ellipse class="topping-corn" cx="8" cy="15" rx="2.4" ry="3"/><circle class="topping-corn-shine" cx="8.5" cy="8.2" r=".7"/><circle class="topping-corn-shine" cx="14.5" cy="7.2" r=".7"/>',
    cebola: '<ellipse class="topping-onion" cx="13" cy="13" rx="9" ry="7"/><ellipse class="topping-onion-line" cx="13" cy="13" rx="6" ry="4.6"/><ellipse class="topping-onion-core" cx="13" cy="13" rx="2.5" ry="1.6"/>',
    tomate: '<circle class="topping-tomato" cx="13" cy="13" r="8"/><circle class="topping-tomato-inner" cx="13" cy="13" r="4.8"/><path class="topping-tomato-seed" d="M12 9l1 2m-4 2 2 .5m4 3-.5-2m2-3-2 .5"/>',
    rucula: '<path class="topping-leaf" d="M4 18 Q5 6 21 5 Q21 17 9 20 Q6 20 4 18Z"/><path class="topping-leaf-vein" d="M5 19 18 8m-8 7 1-5m2 2 4-1"/>',
    azeitona: '<ellipse class="topping-olive" cx="13" cy="13" rx="8" ry="6"/><ellipse class="topping-olive-core" cx="13" cy="13" rx="3" ry="2"/><circle class="topping-olive-shine" cx="9" cy="11" r="1"/>',
    'cream-cheese': '<path class="topping-creamy" d="M4 12 Q5 7 10 9 Q13 5 16 9 Q21 7 22 12 Q23 16 18 17 Q14 21 11 17 Q5 20 4 15Z"/><path class="topping-cream-line" d="M8 13q3-2 5 0t5 0"/>',
  };
  return `<svg viewBox="0 0 26 26" aria-hidden="true">${art[id] || '<path class="topping-herb" d="M5 17 Q6 7 21 6 Q20 19 8 20Z"/><path class="topping-leaf-vein" d="m6 19 12-11"/>'}</svg>`;
}

function renderToppingPieces(id, seed, sliceCenter = null, sliceWidth = 0) {
  return Array.from({ length: 2 }, (_, pieceIndex) => {
    let x;
    let y;
    if (sliceCenter === null) {
      const point = seed * 3 + pieceIndex + 1;
      const angle = point * 2.399963;
      const radius = 17 + ((point * 11) % 55);
      x = 50 + radius * Math.cos(angle);
      y = 50 + radius * Math.sin(angle);
    } else {
      const spread = ((pieceIndex - .5) * .32) * sliceWidth;
      const angle = (sliceCenter + spread) * Math.PI / 180;
      const radius = 23 + ((seed * 19 + pieceIndex * 17) % 43);
      x = 50 + radius * Math.cos(angle);
      y = 50 + radius * Math.sin(angle);
    }
    const size = 13 + ((seed + pieceIndex) % 3) * 2;
    const rotation = ((seed + pieceIndex * 3) % 29) - 14;
    return `<span class="pizza topping topping-${id.startsWith('custom:') ? 'custom' : id}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--piece-size:${size}px;--piece-rotation:${rotation}deg;animation-delay:${pieceIndex * .06}s">${toppingArt(id)}</span>`;
  }).join('');
}

function renderPizza() {
  const pizza = $('#pizza');
  pizza.className = `pizza${state.tamanho ? ` tamanho-${state.tamanho.id}` : ''}${state.massa?.id === 'integral' ? ' massa-integral' : ''}${state.tamanho ? '' : ' idle'}`;
  const canZoomSlice = state.modoRecheio === 'fatia' && state.previewMode === 'slice';
  pizza.classList.toggle('zoom-slice', canZoomSlice);
  const centerAngle = ((state.fatiaAtiva + .5) * 360 / PARTES_SABOR) - 90;
  $('#pizza-content').style.setProperty('--slice-rotation', `${-90 - centerAngle}deg`);
  $('#pizza-hint').classList.toggle('hidden', !!state.tamanho);
  $('#pizza-sauce').classList.toggle('on', state.molho?.id === 'sim');
  const toppingMarkup = state.modoRecheio === 'fatia'
    ? Array.from({ length: PARTES_SABOR }, (_, sliceIndex) => {
      const fillings = state.recheiosPorFatia[sliceIndex] || [];
      const sliceCenter = (sliceIndex + .5) * 360 / PARTES_SABOR - 90;
      const sliceWidth = 360 / PARTES_SABOR;
      return fillings.map((id, toppingIndex) => renderToppingPieces(id, sliceIndex * MAX_RECHEIOS + toppingIndex, sliceCenter, sliceWidth)).join('');
    }).join('')
    : state.recheios.map((id, index) => {
      return renderToppingPieces(id, index);
    }).join('');
  $('#pizza-toppings').innerHTML = toppingMarkup;
  $('#pizza-oregano').innerHTML = state.oregano === 'sim'
    ? Array.from({ length: 32 }, (_, index) => {
      const angle = index * 2.3999;
      const radius = 6 + (index % 6) * 6.5;
      return `<span class="pizza oregano-spec" style="left:${(50 + radius * Math.cos(angle)).toFixed(1)}%;top:${(50 + radius * Math.sin(angle)).toFixed(1)}%"></span>`;
    }).join('') : '';
  const showCuts = (state.step >= 6 && state.step <= 7) || state.modoRecheio === 'fatia';
  const visualPartCount = state.modoRecheio === 'fatia' ? PARTES_SABOR : state.tamanho?.fatias || 8;
  $('#pizza-cuts').innerHTML = showCuts ? renderPizzaGuides(visualPartCount) : '';
  const previewControls = $('#preview-controls');
  previewControls.hidden = state.modoRecheio !== 'fatia';
  previewControls.querySelectorAll('[data-preview-mode]').forEach(button => {
    const selected = button.dataset.previewMode === state.previewMode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const focusedFillings = state.recheiosPorFatia[state.fatiaAtiva] || [];
  const sliceLabel = $('#slice-preview-label');
  sliceLabel.hidden = state.modoRecheio !== 'fatia' || state.previewMode !== 'slice';
  sliceLabel.textContent = `Parte ${state.fatiaAtiva + 1} de ${PARTES_SABOR} · ${focusedFillings.length ? focusedFillings.map(getRecheioLabel).join(' · ') : 'ainda sem recheio'}`;
  const description = [];
  if (state.tamanho) description.push(state.tamanho.label);
  if (state.massa) description.push(`massa ${state.massa.label.toLowerCase()}`);
  if (getRecheiosUnicos().length) description.push(`${getRecheiosUnicos().length} ingrediente${getRecheiosUnicos().length === 1 ? '' : 's'}`);
  $('#pizza-status').textContent = canZoomSlice
    ? `Detalhe da parte ${state.fatiaAtiva + 1} de ${PARTES_SABOR}`
    : description.length ? description.join(' · ') : 'Uma receita esperando por você';
  $('#pizza-legend').innerHTML = [
    state.tamanho && `<li><strong>${state.tamanho.label}</strong></li>`,
    state.massa && `<li>${state.massa.label}</li>`,
    getRecheiosUnicos().length > 0 && `<li>${getRecheiosUnicos().length}/${MAX_RECHEIOS} ingredientes</li>`,
  ].filter(Boolean).join('');
  $('#preview-price').textContent = state.tamanho ? fmt(getTotal()) : '—';
}

function renderPizzaGuides(sliceCount) {
  const selectedIndex = state.fatiaAtiva;
  const selectedStart = (selectedIndex * 360 / sliceCount) - 90;
  const selectedEnd = ((selectedIndex + 1) * 360 / sliceCount) - 90;
  const point = angle => ({
    x: (100 + 92 * Math.cos(angle * Math.PI / 180)).toFixed(2),
    y: (100 + 92 * Math.sin(angle * Math.PI / 180)).toFixed(2),
  });
  const first = point(selectedStart);
  const last = point(selectedEnd);
  const activeSlice = state.modoRecheio === 'fatia' && (state.step === 4 || state.previewMode === 'slice');
  const highlight = activeSlice
    ? `<path class="guide-highlight" d="M 100 100 L ${first.x} ${first.y} A 92 92 0 0 1 ${last.x} ${last.y} Z"/>`
    : '';
  const dividerLines = Array.from({ length: sliceCount }, (_, index) => {
    const edge = point((index * 360 / sliceCount) - 90);
    const isActiveBoundary = activeSlice && (index === selectedIndex || index === (selectedIndex + 1) % sliceCount);
    return `<line class="${isActiveBoundary ? 'guide-line active' : 'guide-line'}" x1="100" y1="100" x2="${edge.x}" y2="${edge.y}"/>`;
  }).join('');
  return `${highlight}${dividerLines}<circle class="guide-rim" cx="100" cy="100" r="92"/>`;
}

function refreshNav() {
  const stepId = ETAPAS[state.step].id;
  const isWelcome = stepId === 'boas-vindas';
  const isComplete = stepId === 'conclusao';
  const showWizard = !isWelcome && !isComplete;
  $('#wizard-nav').hidden = !showWizard;
  $('#btn-prev').hidden = state.step <= 0;
  $('#btn-next').hidden = isComplete || isWelcome;
  $('#btn-next').textContent = stepId === 'checkout' ? 'Confirmar pedido' : 'Continuar →';
  $('#btn-next').disabled = stepId !== 'checkout' && !validate();
  $('#progress').hidden = isWelcome || isComplete;
  $('#pizza-preview').hidden = isComplete || isWelcome;
  $('.layout').classList.toggle('welcome-layout', isWelcome);
  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.toggle('active', index === state.step);
  });
  document.querySelectorAll('[data-progress]').forEach(item => {
    const index = Number(item.dataset.progress);
    item.classList.toggle('active', index === state.step);
    item.classList.toggle('done', index < state.step);
  });
  renderPizza();
}

function goTo(index) {
  if (index < 0 || index >= ETAPAS.length) return;
  state.step = index;
  renderStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function next() {
  if (ETAPAS[state.step].id === 'checkout' && !validateCheckout()) {
    showToast('Confira os dados destacados antes de continuar.');
    return;
  }
  if (!validate()) {
    showToast('Confira os campos obrigatórios antes de continuar.');
    return;
  }
  if (ETAPAS[state.step].id === 'checkout') {
    goTo(8);
    return;
  }
  goTo(state.step + 1);
}

function restart() {
  Object.assign(state, {
    step: 0, tamanho: null, massa: null, molho: null, recheios: [], modoRecheio: 'inteira',
    fatiaAtiva: 0, recheiosPorFatia: {}, previewMode: 'whole', oregano: null,
    pagamento: 'pix', troco: '',
    cliente: { nome: '', telefone: '', rua: '', numero: '', bairro: '', complemento: '', cep: '' },
  });
  goTo(0);
}

function showToast(message) {
  const region = $('#toast-region');
  if ([...region.children].some(toast => toast.textContent === message)) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  region.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}

$('#preview-controls').addEventListener('click', event => {
  const button = event.target.closest('[data-preview-mode]');
  if (!button) return;
  state.previewMode = button.dataset.previewMode;
  renderPizza();
});
$('#pizza-photo').addEventListener('error', event => {
  event.currentTarget.hidden = true;
  $('#pizza').classList.add('photo-unavailable');
});
$('#btn-next').addEventListener('click', next);
$('#btn-prev').addEventListener('click', () => goTo(state.step - 1));
buildProgress();
buildSteps();
goTo(0);
