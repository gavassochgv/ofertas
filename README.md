# Site de Dropshipping - Ofertas Especiais

Um site completo de dropshipping com painel administrativo para gerenciar produtos, ofertas e cupons de desconto.

## Funcionalidades

### Site Principal
- **Página inicial** com design moderno e responsivo
- **Listagem de produtos** com informações detalhadas
- **Exibição de preços** originais e com desconto
- **Cupons de desconto** destacados
- **Links diretos** para os produtos originais
- **Design responsivo** para desktop e mobile

### Painel Administrativo
- **Sistema de login** simples (senha: admin123)
- **Adicionar produtos** com todos os campos necessários
- **Editar produtos** existentes
- **Excluir produtos** (soft delete)
- **Visualizar todos os produtos** em tabela organizada
- **Interface intuitiva** e responsiva

## Estrutura do Banco de Dados

### Tabela: Produtos
- `id`: Chave primária
- `nome`: Nome do produto (obrigatório)
- `descricao`: Descrição detalhada
- `link_produto`: URL do produto original (obrigatório)
- `preco_original`: Preço original (obrigatório)
- `preco_desconto`: Preço com desconto (opcional)
- `cupom_desconto`: Código do cupom (opcional)
- `link_imagem`: URL da imagem do produto (opcional)
- `data_criacao`: Data de criação automática
- `data_atualizacao`: Data de atualização automática
- `ativo`: Status do produto (ativo/inativo)

## Tecnologias Utilizadas

- **Backend**: Flask (Python)
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Frontend**: HTML5, CSS3, JavaScript
- **Estilização**: CSS Grid, Flexbox, Gradientes
- **Ícones**: Font Awesome
- **Deploy**: Vercel

## Como Usar

### Desenvolvimento Local

1. Clone o repositório
2. Navegue até o diretório do projeto
3. Ative o ambiente virtual:
   ```bash
   source venv/bin/activate
   ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
5. Execute o aplicativo:
   ```bash
   python src/main.py
   ```
6. Acesse http://localhost:5000

### Painel Administrativo

1. Acesse http://localhost:5000/admin.html
2. Use a senha: `admin123`
3. Gerencie seus produtos através da interface

### Deploy no Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório ao Vercel
3. Configure as variáveis de ambiente se necessário
4. O deploy será automático

## API Endpoints

### Produtos (Público)
- `GET /api/produtos` - Lista produtos ativos
- `GET /api/produtos/{id}` - Obtém produto específico

### Produtos (Admin)
- `GET /api/admin/produtos` - Lista todos os produtos
- `POST /api/produtos` - Cria novo produto
- `PUT /api/produtos/{id}` - Atualiza produto
- `DELETE /api/produtos/{id}` - Exclui produto (soft delete)

## Estrutura de Arquivos

```
dropshipping-site/
├── src/
│   ├── models/
│   │   ├── user.py
│   │   └── produto.py
│   ├── routes/
│   │   ├── user.py
│   │   └── produto.py
│   ├── static/
│   │   ├── index.html
│   │   ├── admin.html
│   │   ├── styles.css
│   │   ├── admin-styles.css
│   │   ├── script.js
│   │   └── admin-script.js
│   ├── database/
│   │   └── app.db
│   └── main.py
├── venv/
├── requirements.txt
├── vercel.json
└── README.md
```

## Personalização

### Alterando o Design
- Modifique os arquivos CSS em `src/static/`
- Cores principais estão definidas nas variáveis CSS
- Layout responsivo configurado com media queries

### Adicionando Campos
1. Atualize o modelo em `src/models/produto.py`
2. Modifique as rotas em `src/routes/produto.py`
3. Atualize os formulários em `admin.html`
4. Ajuste o JavaScript em `admin-script.js`

### Configurando Banco de Dados Externo
1. Instale o driver apropriado (psycopg2 para PostgreSQL)
2. Atualize a string de conexão em `src/main.py`
3. Configure as variáveis de ambiente no Vercel

## Segurança

⚠️ **Importante**: Este projeto usa autenticação simples para demonstração. Para produção, implemente:
- Sistema de autenticação robusto
- Hash de senhas
- Tokens JWT
- Validação de entrada mais rigorosa
- HTTPS obrigatório

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do Vercel
3. Teste localmente primeiro
4. Verifique as configurações do banco de dados

## Licença

Este projeto é fornecido como exemplo educacional. Use e modifique conforme necessário.

