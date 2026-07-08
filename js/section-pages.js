const pageMap = {
  'pdv.html': 'pdv',
  'funcionarios.html': 'funcionarios',
  'fornecedores.html': 'fornecedores',
  'financeiro.html': 'financeiro',
  'dashboard.html': 'estoque'
};

const pageSettings = {
  estoque: {
    title: 'Estoque',
    description: 'Painel central para controlar entradas, saídas e disponibilidade.',
    cta: 'Novo produto',
    searchPlaceholder: 'Buscar produto...',
    cards: [
      { label: 'Itens em estoque', value: '1.248', detail: 'Atualizado agora' },
      { label: 'Produtos críticos', value: '08', detail: 'Revisar imediatamente' },
      { label: 'Reposição', value: '24', detail: 'Em análise' }
    ],
    items: [
      { name: 'Monitor Gamer 27"', detail: 'SKU: NX-0021', value: '3 un', status: 'Baixo', statusClass: 'warn' },
      { name: 'Teclado Mecânico', detail: 'SKU: NX-0042', value: '12 un', status: 'OK', statusClass: 'ok' },
      { name: 'SSD NVMe 1TB', detail: 'SKU: NX-0101', value: '0 un', status: 'Crítico', statusClass: 'alert' }
    ]
  },
  pdv: {
    title: 'PDV',
    description: 'Gerencie vendas rápidas e acompanhe o caixa em tempo real.',
    cta: 'Nova venda',
    searchPlaceholder: 'Buscar venda ou cliente...',
    cards: [
      { label: 'Caixa aberto', value: 'R$0', detail: 'últimas 24h' },
      { label: 'Vendas hoje', value: '0', detail: 'média R$ 0' },
      { label: 'Tickets', value: '00', detail: 'pendentes' }
    ],
    items: [
      { name: 'Venda #1048', detail: 'Cliente: Não registrado', value: 'R$ 0', status: 'Paga', statusClass: 'ok' },
      { name: 'Venda #1049', detail: 'Cliente: Não registrado', value: 'R$ 0', status: 'Pendente', statusClass: 'warn' },
      { name: 'Venda #1050', detail: 'Cliente: Não registrado', value: 'R$ 0', status: 'Cancelada', statusClass: 'alert' }
    ]
  },
  funcionarios: {
    title: 'Funcionários',
    description: 'Organize sua equipe e acompanhe presença e desempenho.',
    cta: 'Adicionar colaborador',
    searchPlaceholder: 'Buscar funcionário...',
    cards: [
      { label: 'Colaboradores ativos', value: '0', detail: 'equipes operando' },
      { label: 'Turno atual', value: '0', detail: 'pessoas em serviço' },
      { label: 'Faltas', value: '0', detail: 'este mês' }
    ],
    items: [
      { name: 'christopher', detail: 'Dono ', value: 'Presente', status: 'Ativo', statusClass: 'ok' },
      { name: 'joão', detail: 'Dono', value: 'Atraso 10 min', status: 'Aviso', statusClass: 'warn' },
      { name: 'lucas', detail: 'Dono', value: 'Faltou', status: 'Falta', statusClass: 'alert' }
    ]
  },
  fornecedores: {
    title: 'Fornecedores',
    description: 'Acompanhe parceiros comerciais e pedidos em andamento.',
    cta: 'Novo fornecedor',
    searchPlaceholder: 'Buscar fornecedor...',
    cards: [
      { label: 'Parceiros ativos', value: '18', detail: 'conectados' },
      { label: 'Entregas hoje', value: '06', detail: 'programadas' },
      { label: 'Atrasos', value: '01', detail: 'em atendimento' }
    ],
    items: [
      { name: 'Tech Supply', detail: 'Entrega em 24h', value: 'R$ 18.400', status: 'Bom', statusClass: 'ok' },
      { name: 'Nexus Parts', detail: 'Pedido em análise', value: 'R$ 6.200', status: 'Atenção', statusClass: 'warn' },
      { name: 'FastLog', detail: 'Prazo vencido', value: 'R$ 3.900', status: 'Urgente', statusClass: 'alert' }
    ]
  },
  financeiro: {
    title: 'Financeiro',
    description: 'Visão financeira com entradas, saídas e metas do mês.',
    cta: 'Nova cobrança',
    searchPlaceholder: 'Buscar movimentação...',
    cards: [
      { label: 'Receita líquida', value: 'R$ 82.450', detail: 'mês atual' },
      { label: 'Despesas', value: 'R$ 27.900', detail: 'em aberto' },
      { label: 'Margem', value: '68%', detail: 'meta atingida' }
    ],
    items: [
      { name: 'Pagamento de fornecedores', detail: 'Conta de operação', value: 'R$ -4.200', status: 'Pendente', statusClass: 'warn' },
      { name: 'Recebimento de vendas', detail: 'Venda do dia', value: 'R$ +12.300', status: 'Confirmado', statusClass: 'ok' },
      { name: 'Taxas bancárias', detail: 'Cobrança mensal', value: 'R$ -380', status: 'Urgente', statusClass: 'alert' }
    ]
  }
};

const openModal = (title, content, onSubmit = null, submitLabel = 'Salvar') => {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="title">${title}</div>
      <div>${content}</div>
      <div class="actions">
        <button class="btn ghost" type="button" data-close="true">Fechar</button>
        ${onSubmit ? `<button class="btn primary" type="submit" form="modalForm">${submitLabel}</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.querySelector('[data-close="true"]').addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });

  if (onSubmit) {
    const form = backdrop.querySelector('#modalForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      onSubmit(data);
      close();
    });
  }
};

const getPageFormContent = (pageKey) => {
  switch (pageKey) {
    case 'pdv':
      return `
        <form id="modalForm">
          <div class="form-row">
            <input name="name" placeholder="Cliente ou pedido" required>
            <input name="value" placeholder="Valor" required>
          </div>
          <div class="form-row">
            <select name="status">
              <option value="Paga">Paga</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <input name="detail" placeholder="Observação" required>
          </div>
        </form>
      `;
    case 'funcionarios':
      return `
        <form id="modalForm">
          <div class="form-row">
            <input name="name" placeholder="Nome do colaborador" required>
            <input name="detail" placeholder="Função" required>
          </div>
          <div class="form-row">
            <select name="status">
              <option value="Ativo">Ativo</option>
              <option value="Aviso">Aviso</option>
              <option value="Falta">Falta</option>
            </select>
            <input name="value" placeholder="Status do turno" required>
          </div>
        </form>
      `;
    case 'fornecedores':
      return `
        <form id="modalForm">
          <div class="form-row">
            <input name="name" placeholder="Nome do fornecedor" required>
            <input name="detail" placeholder="Prazo ou contato" required>
          </div>
          <div class="form-row">
            <select name="status">
              <option value="Bom">Bom</option>
              <option value="Atenção">Atenção</option>
              <option value="Urgente">Urgente</option>
            </select>
            <input name="value" placeholder="Valor do pedido" required>
          </div>
        </form>
      `;
    case 'financeiro':
      return `
        <form id="modalForm">
          <div class="form-row">
            <input name="name" placeholder="Movimentação" required>
            <input name="value" placeholder="Valor" required>
          </div>
          <div class="form-row">
            <select name="status">
              <option value="Confirmado">Confirmado</option>
              <option value="Pendente">Pendente</option>
              <option value="Urgente">Urgente</option>
            </select>
            <input name="detail" placeholder="Descrição" required>
          </div>
        </form>
      `;
    default:
      return `
        <form id="modalForm">
          <div class="form-row">
            <input name="name" placeholder="Nome do produto" required>
            <input name="detail" placeholder="Categoria" required>
          </div>
          <div class="form-row">
            <input name="value" placeholder="Quantidade" required>
            <input name="status" placeholder="Status" required>
          </div>
        </form>
      `;
  }
};

const getPageKey = () => {
  const pageName = window.location.pathname.split('/').pop();
  return pageMap[pageName] || 'estoque';
};

const renderSidebar = (pageKey) => {
  const sidebar = document.getElementById('sidebar');
  const navItems = [
    { key: 'estoque', label: 'Estoque', href: 'dashboard.html', icon: '📊' },
    { key: 'pdv', label: 'PDV', href: 'pdv.html', icon: '🧾' },
    { key: 'funcionarios', label: 'Funcionários', href: 'funcionarios.html', icon: '👥' },
    { key: 'fornecedores', label: 'Fornecedores', href: 'fornecedores.html', icon: '🔗' },
    { key: 'financeiro', label: 'Financeiro', href: 'financeiro.html', icon: '💰' }
  ];

  sidebar.innerHTML = `
    <div class="brand"><div class="logo">NX</div><div>Nexus ERP</div></div>
    <nav class="nav">
      ${navItems.map(item => `
        <a href="${item.href}" class="${item.key === pageKey ? 'active' : ''}">
          <span>${item.icon}</span> <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
    <div class="spacer"></div>
    <div class="bottom">
      <a href="#">⚙️ Configurações</a>
      <a href="#">🚪 Sair</a>
    </div>
  `;
};

const renderHeader = (config) => {
  const header = document.getElementById('header');
  header.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      <button class="btn ghost" id="menuToggle">☰</button>
      <div class="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#9aa6bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <input placeholder="${config.searchPlaceholder}" id="globalSearch">
      </div>
    </div>
    <div class="actions">
      <button class="btn ghost">Relatório</button>
      <button class="btn primary">${config.cta}</button>
      <div class="profile"><div class="avatar">CS</div><div><div style="font-weight:700">Carlos Silva</div><div style="font-size:12px;color:var(--muted)">Gerente de Loja</div></div></div>
    </div>
  `;

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });
};

const renderContent = (pageKey, config, query = '') => {
  const content = document.getElementById('content');
  const filteredItems = config.items.filter(item => {
    const haystack = `${item.name} ${item.detail} ${item.value}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  content.innerHTML = `
    <div class="section-shell">
      <div class="section-hero">
        <div>
          <h1>${config.title}</h1>
          <p>${config.description}</p>
        </div>
        <button class="btn primary" data-action="add-item">${config.cta}</button>
      </div>
      <div class="section-grid">
        ${config.cards.map(card => `
          <div class="section-card">
            <div class="label">${card.label}</div>
            <div class="value">${card.value}</div>
            <div class="muted">${card.detail}</div>
          </div>
        `).join('')}
      </div>
      <div class="section-list">
        <div class="panel-header" style="margin-bottom:12px">
          <strong>${config.title} recentes</strong>
          <span class="muted">${filteredItems.length} itens</span>
        </div>
        ${filteredItems.length ? filteredItems.map((item, index) => `
          <div class="list-item" data-item-id="${index}">
            <div>
              <div style="font-weight:700">${item.name}</div>
              <div class="muted">${item.detail}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-weight:700">${item.value}</div>
              <div class="status-pill ${item.statusClass}">${item.status}</div>
            </div>
          </div>
        `).join('') : '<div class="muted">Nenhum resultado encontrado.</div>'}
      </div>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const pageKey = getPageKey();
  const config = pageSettings[pageKey];
  renderSidebar(pageKey);
  renderHeader(config);
  renderContent(pageKey, config);

  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-action="add-item"]');
    if (addBtn) {
      openModal(`${config.cta}`, getPageFormContent(pageKey), (data) => {
        const statusClass = data.status && ['Ativo', 'Paga', 'Confirmado', 'Bom'].includes(data.status) ? 'ok' : (data.status === 'Pendente' || data.status === 'Aviso' || data.status === 'Atenção' ? 'warn' : 'alert');
        config.items.unshift({
          name: data.name || 'Novo item',
          detail: data.detail || 'Atualizado agora',
          value: data.value || '—',
          status: data.status || 'Novo',
          statusClass
        });
        renderContent(pageKey, config);
      }, 'Adicionar');
      return;
    }

    const itemRow = event.target.closest('.list-item[data-item-id]');
    if (itemRow) {
      const item = config.items[Number(itemRow.dataset.itemId)];
      if (item) {
        openModal('Detalhes', `
          <div class="helper">Informações da seleção.</div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
            <div><strong>Nome:</strong> ${item.name}</div>
            <div><strong>Detalhe:</strong> ${item.detail}</div>
            <div><strong>Valor:</strong> ${item.value}</div>
            <div><strong>Status:</strong> ${item.status}</div>
          </div>
        `);
      }
    }
  });

  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      renderContent(pageKey, config, event.target.value);
    });
  }
});
