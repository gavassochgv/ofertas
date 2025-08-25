from src.models.user import db
from datetime import datetime

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    link_produto = db.Column(db.String(500), nullable=False)
    preco_original = db.Column(db.Float, nullable=False)
    preco_desconto = db.Column(db.Float, nullable=True)
    cupom_desconto = db.Column(db.String(50), nullable=True)
    link_imagem = db.Column(db.String(500), nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Produto {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'link_produto': self.link_produto,
            'preco_original': self.preco_original,
            'preco_desconto': self.preco_desconto,
            'cupom_desconto': self.cupom_desconto,
            'link_imagem': self.link_imagem,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo
        }

