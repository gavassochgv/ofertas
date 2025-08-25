// Configuração da API
const API_BASE_URL = '/api';

// Função para carregar produtos
async function carregarProdutos() {
    const productsGrid = document.getElementById('products-grid');
    
    try {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const produtos = await response.json();
        
        // Limpar o loading
        productsGrid.innerHTML = '';
        
        if (produtos.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <p>Nenhum produto disponível no momento.</p>
                </div>
            `;
            return;
        }
        
        // Renderizar produtos
        produtos.forEach(produto => {
            const productCard = criarCardProduto(produto);
            productsGrid.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar produtos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para criar card do produto
function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Calcular desconto percentual
    let descontoPercentual = '';
    if (produto.preco_desconto && produto.preco_original > produto.preco_desconto) {
        const desconto = Math.round(((produto.preco_original - produto.preco_desconto) / produto.preco_original) * 100);
        descontoPercentual = `<span class="discount-badge">-${desconto}%</span>`;
    }
    
    // Formatação de preços
    const precoOriginal = produto.preco_original ? `R$ ${produto.preco_original.toFixed(2).replace('.', ',')}` : '';
    const precoDesconto = produto.preco_desconto ? `R$ ${produto.preco_desconto.toFixed(2).replace('.', ',')}` : '';
    
    // Imagem do produto
    const imagemProduto = produto.link_imagem 
        ? `<img src="${produto.link_imagem}" alt="${produto.nome}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
    
    const imagemPlaceholder = `<div class="product-image" style="${produto.link_imagem ? 'display:none;' : ''}"><i class="fas fa-image"></i></div>`;
    
    card.innerHTML = `
        ${imagemProduto}
        ${imagemPlaceholder}
        <div class="product-info">
            <h3 class="product-name">${produto.nome}</h3>
            ${produto.descricao ? `<p class="product-description">${produto.descricao}</p>` : ''}
            
            <div class="product-prices">
                ${produto.preco_desconto ? `<span class="price-original">${precoOriginal}</span>` : ''}
                <span class="price-discount">${produto.preco_desconto ? precoDesconto : precoOriginal}</span>
                ${descontoPercentual}
            </div>
            
            ${produto.cupom_desconto ? `<div class="coupon-code">Cupom: ${produto.cupom_desconto}</div>` : ''}
            
            <a href="${produto.link_produto}" target="_blank" rel="noopener noreferrer" class="product-link">
                <i class="fas fa-external-link-alt"></i> Ver Produto
            </a>
        </div>
    `;
    
    return card;
}

// Função para scroll suave
function scrollSuave(elemento) {
    document.querySelector(elemento).scrollIntoView({
        behavior: 'smooth'
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos ao carregar a página
    carregarProdutos();
    
    // Scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                scrollSuave(target);
            }
        });
    });
    
    // Menu mobile (funcionalidade básica)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        });
    });
});

// Função para recarregar produtos (útil para o painel admin)
function recarregarProdutos() {
    carregarProdutos();
}

// Exportar funções para uso global
window.carregarProdutos = carregarProdutos;
window.recarregarProdutos = recarregarProdutos;

