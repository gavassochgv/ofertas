// Configuração da API
const API_BASE_URL = '/api';

// Senha simples para demonstração (em produção, usar autenticação real)
const ADMIN_PASSWORD = 'admin123';

// Estado da aplicação
let isLoggedIn = false;
let produtos = [];

// Elementos DOM
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    configurarEventListeners();
});

// Verificar se já está logado
function verificarLogin() {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
        fazerLogin();
    }
}

// Configurar event listeners
function configurarEventListeners() {
    // Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('admin_logged_in', 'true');
            fazerLogin();
        } else {
            mostrarErroLogin('Senha incorreta!');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('admin_logged_in');
        fazerLogout();
    });
    
    // Adicionar produto
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarProduto();
    });
    
    // Editar produto
    document.getElementById('edit-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarEdicaoProduto();
    });
    
    // Atualizar lista de produtos
    document.getElementById('refresh-products').addEventListener('click', function() {
        carregarProdutos();
    });
    
    // Fechar modal
    document.querySelector('.close').addEventListener('click', function() {
        fecharModal();
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('edit-modal');
        if (e.target === modal) {
            fecharModal();
        }
    });
}

// Fazer login
function fazerLogin() {
    isLoggedIn = true;
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
    carregarProdutos();
}

// Fazer logout
function fazerLogout() {
    isLoggedIn = false;
    loginSection.style.display = 'block';
    adminPanel.style.display = 'none';
    document.getElementById('admin-password').value = '';
    esconderErroLogin();
}

// Mostrar erro de login
function mostrarErroLogin(mensagem) {
    loginError.textContent = mensagem;
    loginError.style.display = 'block';
}

// Esconder erro de login
function esconderErroLogin() {
    loginError.style.display = 'none';
}

// Carregar produtos
async function carregarProdutos() {
    const container = document.getElementById('products-table-container');
    
    try {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando produtos...</p>
            </div>
        `;
        
        const response = await fetch(`${API_BASE_URL}/admin/produtos`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        produtos = await response.json();
        renderizarTabelaProdutos();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = `
            <div class="error-message" style="display: block;">
                Erro ao carregar produtos: ${error.message}
            </div>
        `;
    }
}

// Renderizar tabela de produtos
function renderizarTabelaProdutos() {
    const container = document.getElementById('products-table-container');
    
    if (produtos.length === 0) {
        container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }
    
    const tabela = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Preço Original</th>
                    <th>Preço Desconto</th>
                    <th>Cupom</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${produtos.map(produto => `
                    <tr>
                        <td>${produto.id}</td>
                        <td>
                            ${produto.link_imagem ? 
                                `<img src="${produto.link_imagem}" alt="${produto.nome}" class="product-image-thumb" onerror="this.style.display='none'">` : 
                                '<i class="fas fa-image" style="color: #ccc; font-size: 2rem;"></i>'
                            }
                        </td>
                        <td>
                            <strong>${produto.nome}</strong>
                            ${produto.descricao ? `<br><small>${produto.descricao.substring(0, 50)}${produto.descricao.length > 50 ? '...' : ''}</small>` : ''}
                        </td>
                        <td>R$ ${produto.preco_original.toFixed(2).replace('.', ',')}</td>
                        <td>${produto.preco_desconto ? `R$ ${produto.preco_desconto.toFixed(2).replace('.', ',')}` : '-'}</td>
                        <td>${produto.cupom_desconto || '-'}</td>
                        <td>
                            <span class="product-status ${produto.ativo ? 'status-active' : 'status-inactive'}">
                                ${produto.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </td>
                        <td>
                            <div class="product-actions">
                                <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id})">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id})">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tabela;
}

// Adicionar produto
async function adicionarProduto() {
    const form = document.getElementById('add-product-form');
    const messageDiv = document.getElementById('add-product-message');
    
    try {
        const dados = {
            nome: document.getElementById('product-name').value,
            descricao: document.getElementById('product-description').value,
            link_produto: document.getElementById('product-link').value,
            preco_original: parseFloat(document.getElementById('product-price-original').value),
            preco_desconto: document.getElementById('product-price-discount').value ? 
                parseFloat(document.getElementById('product-price-discount').value) : null,
            cupom_desconto: document.getElementById('product-coupon').value,
            link_imagem: document.getElementById('product-image').value
        };
        
        const response = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarMensagem(messageDiv, 'Produto adicionado com sucesso!', 'success');
            form.reset();
            carregarProdutos();
        } else {
            mostrarMensagem(messageDiv, `Erro: ${resultado.erro}`, 'error');
        }
        
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        mostrarMensagem(messageDiv, `Erro ao adicionar produto: ${error.message}`, 'error');
    }
}

// Editar produto
function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    // Preencher o formulário de edição
    document.getElementById('edit-product-id').value = produto.id;
    document.getElementById('edit-product-name').value = produto.nome;
    document.getElementById('edit-product-description').value = produto.descricao || '';
    document.getElementById('edit-product-link').value = produto.link_produto;
    document.getElementById('edit-product-price-original').value = produto.preco_original;
    document.getElementById('edit-product-price-discount').value = produto.preco_desconto || '';
    document.getElementById('edit-product-coupon').value = produto.cupom_desconto || '';
    document.getElementById('edit-product-image').value = produto.link_imagem || '';
    document.getElementById('edit-product-active').checked = produto.ativo;
    
    // Mostrar modal
    document.getElementById('edit-modal').style.display = 'block';
}

// Salvar edição do produto
async function salvarEdicaoProduto() {
    const id = document.getElementById('edit-product-id').value;
    const messageDiv = document.getElementById('edit-product-message');
    
    try {
        const dados = {
            nome: document.getElementById('edit-product-name').value,
            descricao: document.getElementById('edit-product-description').value,
            link_produto: document.getElementById('edit-product-link').value,
            preco_original: parseFloat(document.getElementById('edit-product-price-original').value),
            preco_desconto: document.getElementById('edit-product-price-discount').value ? 
                parseFloat(document.getElementById('edit-product-price-discount').value) : null,
            cupom_desconto: document.getElementById('edit-product-coupon').value,
            link_imagem: document.getElementById('edit-product-image').value,
            ativo: document.getElementById('edit-product-active').checked
        };
        
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarMensagem(messageDiv, 'Produto atualizado com sucesso!', 'success');
            setTimeout(() => {
                fecharModal();
                carregarProdutos();
            }, 1500);
        } else {
            mostrarMensagem(messageDiv, `Erro: ${resultado.erro}`, 'error');
        }
        
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        mostrarMensagem(messageDiv, `Erro ao atualizar produto: ${error.message}`, 'error');
    }
}

// Excluir produto
async function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Produto excluído com sucesso!');
            carregarProdutos();
        } else {
            const resultado = await response.json();
            alert(`Erro ao excluir produto: ${resultado.erro}`);
        }
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert(`Erro ao excluir produto: ${error.message}`);
    }
}

// Fechar modal
function fecharModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-product-message').style.display = 'none';
}

// Mostrar mensagem
function mostrarMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `message ${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// Exportar funções para uso global
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.fecharModal = fecharModal;

