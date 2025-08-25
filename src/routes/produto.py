from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.produto import Produto
from datetime import datetime

produto_bp = Blueprint('produto', __name__)

@produto_bp.route('/produtos', methods=['GET'])
def listar_produtos():
    """Lista todos os produtos ativos"""
    try:
        produtos = Produto.query.filter_by(ativo=True).all()
        return jsonify([produto.to_dict() for produto in produtos]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def obter_produto(produto_id):
    """Obtém um produto específico por ID"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        return jsonify(produto.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos', methods=['POST'])
def criar_produto():
    """Cria um novo produto"""
    try:
        dados = request.get_json()
        
        # Validação básica
        if not dados.get('nome') or not dados.get('link_produto') or not dados.get('preco_original'):
            return jsonify({'erro': 'Nome, link do produto e preço original são obrigatórios'}), 400
        
        novo_produto = Produto(
            nome=dados['nome'],
            descricao=dados.get('descricao'),
            link_produto=dados['link_produto'],
            preco_original=float(dados['preco_original']),
            preco_desconto=float(dados['preco_desconto']) if dados.get('preco_desconto') else None,
            cupom_desconto=dados.get('cupom_desconto'),
            link_imagem=dados.get('link_imagem'),
            ativo=dados.get('ativo', True)
        )
        
        db.session.add(novo_produto)
        db.session.commit()
        
        return jsonify(novo_produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def atualizar_produto(produto_id):
    """Atualiza um produto existente"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        dados = request.get_json()
        
        # Atualiza os campos fornecidos
        if 'nome' in dados:
            produto.nome = dados['nome']
        if 'descricao' in dados:
            produto.descricao = dados['descricao']
        if 'link_produto' in dados:
            produto.link_produto = dados['link_produto']
        if 'preco_original' in dados:
            produto.preco_original = float(dados['preco_original'])
        if 'preco_desconto' in dados:
            produto.preco_desconto = float(dados['preco_desconto']) if dados['preco_desconto'] else None
        if 'cupom_desconto' in dados:
            produto.cupom_desconto = dados['cupom_desconto']
        if 'link_imagem' in dados:
            produto.link_imagem = dados['link_imagem']
        if 'ativo' in dados:
            produto.ativo = dados['ativo']
        
        produto.data_atualizacao = datetime.utcnow()
        db.session.commit()
        
        return jsonify(produto.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def excluir_produto(produto_id):
    """Exclui um produto (soft delete - marca como inativo)"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        produto.ativo = False
        produto.data_atualizacao = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'mensagem': 'Produto excluído com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produto_bp.route('/admin/produtos', methods=['GET'])
def listar_todos_produtos():
    """Lista todos os produtos (incluindo inativos) - para o painel administrativo"""
    try:
        produtos = Produto.query.all()
        return jsonify([produto.to_dict() for produto in produtos]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

