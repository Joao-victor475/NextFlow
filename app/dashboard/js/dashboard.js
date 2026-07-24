const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* Sample data - to be replaced/merged with real project data */
const cardsData = [
  {title:'Total de Itens', value:'1,248', desc:'+12% este mês', color:'var(--primary)', icon:'📦'},
  {title:'Estoque Crítico', value:'08', desc:'Ação imediata necessária', color:'#ef4444', icon:'⚠️'},
  {title:'Alerta de Reposição', value:'24', desc:'Sugestão de pedido gerada', color:'#f59e0b', icon:'🔔'},
  {title:'Valor em Estoque', value:'R$425K', desc:'Custo Total Estimado', color:'#2563eb', icon:'💰'}
];

let produtos = [
  {id:'#NX-0021', nome:'Monitor Gamer 27" 144Hz', categoria:'Eletrônicos', estoque:3, preco:'R$ 1.890,00'},
  {id:'#NX-0042', nome:'Teclado Mecânico RGB', categoria:'Periféricos', estoque:12, preco:'R$ 450,00'},
  {id:'#NX-0115', nome:'Mouse Óptico Wireless', categoria:'Periféricos', estoque:84, preco:'R$ 125,00'},
  {id:'#NX-0098', nome:'Headset Wireless Noise Cancelling', categoria:'Áudio', estoque:15, preco:'R$ 899,00'},
  {id:'#NX-0101', nome:'SSD NVMe 1TB', categoria:'Eletrônicos', estoque:0, preco:'R$ 699,00'},
  {id:'#NX-0202', nome:'Cabo HDMI 2.1', categoria:'Acessórios', estoque:45, preco:'R$ 39,90'},
];

const formatPrice = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

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

const openProductForm = () => {
  openModal('Adicionar produto', `
    <form id="modalForm">
      <div class="form-row">
        <input name="nome" placeholder="Nome do produto" required>
        <input name="categoria" placeholder="Categoria" required>
      </div>
      <div class="form-row">
        <input name="estoque" type="number" min="0" placeholder="Estoque" required>
        <input name="preco" type="number" step="0.01" min="0" placeholder="Preço" required>
      </div>
      <div class="helper">O item será adicionado à lista de estoque.</div>
    </form>
  `, (data) => {
    const nextId = `#NX-${String(produtos.length + 1).padStart(4, '0')}`;
    produtos = [{
      id: nextId,
      nome: data.nome,
      categoria: data.categoria,
      estoque: Number(data.estoque) || 0,
      preco: formatPrice(data.preco)
    }, ...produtos];
    renderTable(produtos);
    renderPagination(Math.max(1, Math.ceil(produtos.length / 5)), 1);
  });
};

const openProductDetails = (product) => {
  openModal('Detalhes do produto', `
    <div class="helper">Resumo do item selecionado.</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
      <div><strong>Nome:</strong> ${product.nome}</div>
      <div><strong>ID:</strong> ${product.id}</div>
      <div><strong>Categoria:</strong> ${product.categoria}</div>
      <div><strong>Estoque:</strong> ${product.estoque} un</div>
      <div><strong>Preço:</strong> ${product.preco}</div>
    </div>
  `);
};

/* Renders */
const renderSidebar = () => {
  const sidebar = $('#sidebar');
  sidebar.innerHTML = `
    <div class="brand"><div class="logo">NX</div><div>Nexus ERP</div></div>
    <nav class="nav">
      <a href="dashboard.html" class="active">📊 <span>Estoque</span></a>
      <a href="pdv.html">🧾 <span>PDV</span></a>
      <a href="funcionarios.html">👥 <span>Funcionários</span></a>
      <a href="fornecedores.html">🔗 <span>Fornecedores</span></a>
      <a href="financeiro.html">💰 <span>Financeiro</span></a>
    </nav>
    <div class="spacer"></div>
    <div class="bottom">
      <a href="#">⚙️ Configurações</a>
      <a href="#">🚪 Sair</a>
    </div>
  `;
};

const renderHeader = () => {
  const header = $('#header');
  header.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      <button class="btn ghost" id="menuToggle">☰</button>
      <div class="search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#9aa6bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><input placeholder="Buscar no estoque..." id="globalSearch"></div>
    </div>
    <div class="actions">
      <button class="btn ghost">Exportar Relatório</button>
      <button class="btn primary" id="addProduct">+ Adicionar Produto</button>
      <div class="btn ghost">🔔</div>
      <div class="btn ghost">❓</div>
      <div class="profile"><div class="avatar">CS</div><div><div style="font-weight:700">Carlos Silva</div><div style="font-size:12px;color:var(--muted)">Gerente de Loja</div></div></div>
    </div>
  `;

  $('#menuToggle').addEventListener('click', ()=>{
    document.querySelector('.sidebar').classList.toggle('open');
  });

  $('#addProduct').addEventListener('click', openProductForm);
};

const renderCards = (cards) => {
  const container = $('#cards');
  container.innerHTML = '';
  cards.forEach(c=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="meta">
        <div class="title">${c.title}</div>
        <div class="value">${c.value}</div>
        <div class="desc">${c.desc}</div>
      </div>
      <div class="icon" style="background:${c.color}">${c.icon}</div>
    `;
    container.appendChild(el);
  });
};

const badgeFor = (qty) => {
  if (qty === 0) return {cls:'critical', text:'Crítico'};
  if (qty > 0 && qty <=12) return {cls:'low', text:'Baixo'};
  return {cls:'ok', text:'OK'};
};

const renderTable = (items) => {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  items.forEach(p=>{
    const tr = document.createElement('tr');
    const badge = badgeFor(p.estoque);
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>
        <div class="product-cell">
          <div class="product-thumb">🖼️</div>
          <div>
            <div style="font-weight:700">${p.nome}</div>
            <div style="font-size:12px;color:var(--muted)">SKU: ${p.id.replace('#','')}</div>
          </div>
        </div>
      </td>
      <td>${p.categoria}</td>
      <td><div class="badge ${badge.cls}">${p.estoque} un</div></td>
      <td>${p.preco}</td>
      <td><button class="btn ghost view-btn" data-id="${p.id}">Ver</button></td>
    `;
    tbody.appendChild(tr);
  });
};

const renderChips = () => {
  const chips = $('#chips');
  chips.innerHTML = '';
  ['Todos','Ativos','Arquivados'].forEach(label=>{
    const b = document.createElement('div');
    b.className = 'chip';
    b.textContent = label;
    chips.appendChild(b);
  });
};

const renderPanelActions = () => {
  const pa = $('#panelActions');
  pa.innerHTML = '';
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn ghost';
  exportBtn.textContent = 'Exportar Relatório';
  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = '+ Adicionar Produto';
  pa.appendChild(exportBtn);
  pa.appendChild(addBtn);
};

const renderPagination = (total = 1, current = 1) => {
  const wrap = $('#pagination');
  wrap.innerHTML = '';
  for(let i=1;i<=total;i++){
    const b = document.createElement('div');
    b.className = 'pager'+(i===current? ' active':'');
    b.textContent = i;
    wrap.appendChild(b);
  }
};

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('.view-btn');
  if (viewButton) {
    const product = produtos.find((item) => item.id === viewButton.dataset.id);
    if (product) openProductDetails(product);
  }
});

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  renderSidebar();
  renderHeader();
  renderCards(cardsData);
  renderChips();
  renderPanelActions();
  renderTable(produtos);
  renderPagination(3,1);

  // Wire search visual filtering (only UI for now)
  $('#globalSearch').addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = produtos.filter(p=>p.nome.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    renderTable(filtered);
  });
});

export {
  renderSidebar,
  renderHeader,
  renderCards,
  renderTable,
};
