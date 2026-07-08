const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* Sample data - add 'status' for filters */
const cardsData = [
  {title:'Total de Itens', value:'1,248', desc:'+12% este mês', color:'var(--primary)', icon:'📦'},
  {title:'Estoque Crítico', value:'08', desc:'Ação imediata necessária', color:'#ef4444', icon:'⚠️'},
  {title:'Alerta de Reposição', value:'24', desc:'Sugestão de pedido gerada', color:'#f59e0b', icon:'🔔'},
  {title:'Valor em Estoque', value:'R$425K', desc:'Custo Total Estimado', color:'#2563eb', icon:'💰'}
];

const produtos = [
  {id:'#NX-0021', nome:'Monitor Gamer 27" 144Hz', categoria:'Eletrônicos', estoque:3, preco:'R$ 1.890,00', status:'ativo'},
  {id:'#NX-0042', nome:'Teclado Mecânico RGB', categoria:'Periféricos', estoque:12, preco:'R$ 450,00', status:'ativo'},
  {id:'#NX-0115', nome:'Mouse Óptico Wireless', categoria:'Periféricos', estoque:84, preco:'R$ 125,00', status:'ativo'},
  {id:'#NX-0098', nome:'Headset Wireless Noise Cancelling', categoria:'Áudio', estoque:15, preco:'R$ 899,00', status:'ativo'},
  {id:'#NX-0101', nome:'SSD NVMe 1TB', categoria:'Eletrônicos', estoque:0, preco:'R$ 699,00', status:'arquivado'},
  {id:'#NX-0202', nome:'Cabo HDMI 2.1', categoria:'Acessórios', estoque:45, preco:'R$ 39,90', status:'ativo'},
];

/* App state */
const state = {
  filter: 'Todos',
  query: '',
  page: 1,
  pageSize: 5,
  currentNav: 'Estoque'
};

/* Renders */
const renderSidebar = () => {
  const sidebar = $('#sidebar');
  sidebar.innerHTML = `
    <div class="brand"><div class="logo">NX</div><div>Nexus ERP</div></div>
    <nav class="nav">
      <a href="#" data-page="Estoque" class="active">📊 <span>Estoque</span></a>
      <a href="#" data-page="PDV">🧾 <span>PDV</span></a>
      <a href="#" data-page="Estoque">📦 <span>Estoque</span></a>
      <a href="#" data-page="Funcionarios">👥 <span>Funcionários</span></a>
      <a href="#" data-page="Fornecedores">🔗 <span>Fornecedores</span></a>
      <a href="#" data-page="Financeiro">💰 <span>Financeiro</span></a>
    </nav>
    <div class="spacer"></div>
    <div class="bottom">
      <a href="#">⚙️ Configurações</a>
      <a href="#">🚪 Sair</a>
    </div>
  `;

  $$('.nav a', sidebar).forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      $$('.nav a', sidebar).forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      state.currentNav = a.dataset.page;
      // Simple content switch: for pages other than Estoque, show placeholder
      const main = document.querySelector('.main');
      if(state.currentNav !== 'Estoque'){
        main.querySelector('.cards').style.display = 'none';
        main.querySelector('.panel').innerHTML = `<div style="padding:20px;background:var(--card);border-radius:12px;box-shadow:var(--shadow)"><h3>${state.currentNav}</h3><p style="color:var(--muted)">Conteúdo de ${state.currentNav} — placeholder</p></div>`;
      } else {
        main.querySelector('.cards').style.display = '';
        // restore panel markup
        main.querySelector('.panel').innerHTML = `
          <div class="panel-header">
            <div class="filter-row">
              <div class="chips" id="chips"></div>
              <div class="filter-btn chip">Filtrar</div>
            </div>
            <div class="actions" id="panelActions"></div>
          </div>
          <div class="table-wrap">
            <table id="productsTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Qtd. Estoque</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div class="pagination" id="pagination"></div>
          </div>`;
        // reinitialize panel controls
        renderChips();
        renderPanelActions();
        bindControls();
        renderTable();
      }
    });
  });
};

const renderHeader = () => {
  const header = $('#header');
  header.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      <button class="btn ghost" id="menuToggle">☰</button>
      <div class="search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#9aa6bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><input placeholder="Buscar no estoque..." id="globalSearch"></div>
    </div>
    <div class="actions">
      <button class="btn ghost" id="exportBtn">Exportar Relatório</button>
      <button class="btn primary" id="addProduct">+ Adicionar Produto</button>
      <div class="btn ghost">🔔</div>
      <div class="btn ghost">❓</div>
      <div class="profile"><div class="avatar"><img src="${new URL('../img/logo_nexus.png', import.meta.url).href}" alt="Logo Nexus"></div><div><div style="font-weight:700">Carlos Silva</div><div style="font-size:12px;color:var(--muted)">Gerente de Loja</div></div></div>
    </div>
  `;

  $('#menuToggle').addEventListener('click', ()=>{
    document.querySelector('.sidebar').classList.toggle('open');
  });
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

const applyFilters = () => {
  let list = produtos.slice();
  if(state.filter === 'Ativos') list = list.filter(p=>p.status === 'ativo');
  if(state.filter === 'Arquivados') list = list.filter(p=>p.status === 'arquivado');
  if(state.query) list = list.filter(p=>p.nome.toLowerCase().includes(state.query) || p.id.toLowerCase().includes(state.query));
  return list;
};

const renderTable = () => {
  const all = applyFilters();
  const totalPages = Math.max(1, Math.ceil(all.length / state.pageSize));
  if(state.page > totalPages) state.page = totalPages;
  const start = (state.page - 1) * state.pageSize;
  const pageItems = all.slice(start, start + state.pageSize);

  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  pageItems.forEach(p=>{
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

  renderPagination(totalPages, state.page);

  // bind view buttons
  $$('.view-btn').forEach(b=>b.addEventListener('click',(e)=>{
    const id = e.currentTarget.dataset.id;
    const product = produtos.find(x=>x.id === id);
    openViewModal(product);
  }));
};

const renderChips = () => {
  const chips = $('#chips');
  chips.innerHTML = '';
  ['Todos','Ativos','Arquivados'].forEach(label=>{
    const b = document.createElement('div');
    b.className = 'chip';
    b.textContent = label;
    if(label === state.filter) b.style.boxShadow = 'inset 0 0 0 2px rgba(29,78,216,0.08)';
    b.addEventListener('click', ()=>{
      state.filter = label;
      state.page = 1;
      renderChips();
      renderTable();
    });
    chips.appendChild(b);
  });
};

const renderPanelActions = () => {
  const pa = $('#panelActions');
  pa.innerHTML = '';
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn ghost';
  exportBtn.textContent = 'Exportar Relatório';
  exportBtn.id = 'exportCSV';
  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = '+ Adicionar Produto';
  addBtn.id = 'addBtnPanel';
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
    b.addEventListener('click', ()=>{
      state.page = i;
      renderTable();
    });
    wrap.appendChild(b);
  }
};

/* Modals */
const openModal = (html) => {
  const container = document.getElementById('modals');
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal">${html}</div>`;
  backdrop.addEventListener('click',(e)=>{ if(e.target === backdrop) container.removeChild(backdrop); });
  container.appendChild(backdrop);
  return backdrop;
};

const closeModal = (backdrop) => { backdrop.parentNode.removeChild(backdrop); };

const openAddModal = () => {
  const html = `
    <div class="title">Adicionar Produto</div>
    <div class="form">
      <div class="form-row"><input id="pId" placeholder="ID (ex: #NX-123)" /></div>
      <div class="form-row"><input id="pNome" placeholder="Nome do produto" /></div>
      <div class="form-row"><input id="pCategoria" placeholder="Categoria" /><input id="pEstoque" placeholder="Estoque" /></div>
      <div class="form-row"><input id="pPreco" placeholder="Preço" /><select id="pStatus"><option value="ativo">Ativo</option><option value="arquivado">Arquivado</option></select></div>
      <div class="actions"><button class="btn ghost" id="cancelAdd">Cancelar</button><button class="btn primary" id="saveAdd">Salvar</button></div>
    </div>`;
  const b = openModal(html);
  b.querySelector('#cancelAdd').addEventListener('click',()=>b.remove());
  b.querySelector('#saveAdd').addEventListener('click',()=>{
    const id = b.querySelector('#pId').value.trim() || (`#NX-${Math.floor(Math.random()*9000)+1000}`);
    const nome = b.querySelector('#pNome').value.trim() || 'Produto sem nome';
    const categoria = b.querySelector('#pCategoria').value.trim() || 'Categoria';
    const estoque = parseInt(b.querySelector('#pEstoque').value,10) || 0;
    const preco = b.querySelector('#pPreco').value.trim() || 'R$ 0,00';
    const status = b.querySelector('#pStatus').value;
    produtos.unshift({id,nome,categoria,estoque,preco,status});
    b.remove();
    renderTable();
    renderChips();
  });
};

const openViewModal = (product) => {
  const html = `
    <div class="title">${product.nome}</div>
    <div style="color:var(--muted);margin-bottom:8px">${product.categoria} — ${product.id}</div>
    <div style="display:flex;gap:12px"><div style="font-weight:700">Estoque</div><div>${product.estoque} un</div></div>
    <div style="margin-top:8px">Preço: <strong>${product.preco}</strong></div>
    <div class="actions"><button class="btn ghost" id="closeView">Fechar</button></div>
  `;
  const b = openModal(html);
  b.querySelector('#closeView').addEventListener('click',()=>b.remove());
};

const exportCSV = () => {
  const list = applyFilters();
  const headers = ['id','nome','categoria','estoque','preco','status'];
  const rows = [headers.join(',')].concat(list.map(p=>headers.map(h=>`"${(p[h]||'').toString().replace(/"/g,'""')}"`).join(',')));
  const blob = new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'produtos.csv'; a.click(); URL.revokeObjectURL(url);
};

const bindControls = () => {
  const search = $('#globalSearch');
  if(search){
    search.addEventListener('input',(e)=>{ state.query = e.target.value.trim().toLowerCase(); state.page = 1; renderTable(); });
  }
  const exportBtn = $('#exportCSV') || $('#exportBtn');
  if(exportBtn) exportBtn.addEventListener('click', exportCSV);
  const addBtn = $('#addBtnPanel') || $('#addProduct');
  if(addBtn) addBtn.addEventListener('click', openAddModal);
};

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  renderSidebar();
  renderHeader();
  renderCards(cardsData);
  renderChips();
  renderPanelActions();
  bindControls();
  renderTable();
});

export {
  renderSidebar,
  renderHeader,
  renderCards,
  renderTable,
};
