from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource, fields
from models import db, Usuario, Livro, Avaliacao, UsuarioLivro, bcrypt
from utils.validators import email_valido_completo, senha_valida, sinopse_valida

# Definir o namespace
api = Namespace('livros', description='Operações relacionadas a livros')

usuario_namespace = Namespace('usuarios', description='Operações relacionadas a usuários')
livros_namespace = Namespace('livros', description='Operações relacionadas a livros')


login_usuario_modelo = usuario_namespace.model('Login de usuario', {
    'email': fields.String(description='Email do usuário', required=True, example='admin@admin.com'),
    'senha': fields.String(description='Senha do usuário', required=True, example='admin123'),
})

# Definir o modelo de entrada para o cadastro de usuário
cadastro_usuario_modelo = usuario_namespace.model('Cadastro Usuario', {
    'nome': fields.String(required=True, description='Nome completo do usuário', example='Antonio'),
    'email': fields.String(required=True, description='Email do usuário', example='antonio@hotmail.com'),
    'senha': fields.String(required=True, description='Senha do usuário', example='antonio123'),
})

usuario_modelo = usuario_namespace.model('Usuario', {
    'id': fields.Integer(description='ID do usuário', example=1),
    'nome': fields.String(description='Nome do usuário', required=True, example='João Silva'),
    'email': fields.String(description='Email do usuário', required=True, example='joao@email.com'),
    'role': fields.String(description='Role do usuário', required=True, example='admin'),
})

cadastro_livro_modelo = livros_namespace.model('Cadastro Livro', {
    'nome': fields.String(description='Nome do livro', required=True, example='O Senhor dos Anéis'),
    'autor': fields.String(description='Autor do livro', example='Antonio Carlos.'),
    'sinopse': fields.String(description='Sinopse do livro', example='Uma aventura épica na Terra Média.'),
})

livro_modelo = livros_namespace.model('Livro', {
    'id': fields.Integer(description='ID do livro', example=1),
    'nome': fields.String(description='Nome do livro', required=True, example='O Senhor dos Anéis'),
    'autor': fields.String(description='Autor do livro', example='Antonio Carlos.'),
    'sinopse': fields.String(description='Sinopse do livro', example='Uma aventura épica na Terra Média.'),
    'avaliacao': fields.Integer(description='Avaliação do livro', example=5),
    'cadastrado_por': fields.Integer(description='ID do usuário que cadastrou o livro', example=1),
})

avaliacao_modelo = livros_namespace.model('Avaliação', {
    'descricao': fields.String(description='Seu comentário aqui', example='Um excelente livro.'),
    'nota': fields.Integer(description='Avaliação do livro', example=5),
})

# ** Roteamento de Autenticação (Login) **
@usuario_namespace.route('/login')
class AutenticacaoResource(Resource):
    @usuario_namespace.expect(login_usuario_modelo)
    def post(self):
        """
        Endpoint para login do usuário. O usuário fornece seu email e senha,
        que são validados para verificar as credenciais.
        Se as credenciais forem válidas, um token de acesso é gerado e retornado.
        """
        data = request.get_json()
        email = data.get("email")
        senha = data.get("senha")

        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario:
            return {"mensagem": "Credenciais inválidas"}, 401

        if not bcrypt.check_password_hash(usuario.senha, senha):
            return {"mensagem": "Credenciais inválidas"}, 401

        access_token = create_access_token(identity=str(usuario.id), additional_claims={"role": usuario.role, "id": usuario.id})

        return {"access_token": access_token}, 200

    
# ** Roteamento de Usuario **
@usuario_namespace.route('/cadastrar', methods=["POST"])
class CadastrarUsuario(Resource):
    @usuario_namespace.expect(cadastro_usuario_modelo)
    def post(self): 
        """
        Endpoint para cadastrar um novo usuário. O usuário precisa fornecer
        o nome, email e senha. O email será validado para garantir que não 
        seja repetido e a senha será verificada para garantir que tenha no mínimo 
        8 caracteres.
        """
        data = request.get_json()
        nome = data.get("nome")
        email = data.get("email")
        senha = data.get("senha")

        # Verificação de email válido
        if not email_valido_completo(email):
            return {"mensagem": "Email inválido"}, 400
        
        # Verificação de senha válida
        if not senha_valida(senha):
             return {"mensagem": "A senha deve ter 8 ou mais caracteres"}, 400

        if Usuario.query.filter_by(email=email).first():
             return {"mensagem": "Email já cadastrado"}, 400

        usuario = Usuario(nome, email, senha, role="CLIENTE")
        db.session.add(usuario)
        db.session.commit()
        return {"mensagem": "Usuário cadastrado com sucesso!"}, 201

@usuario_namespace.route('/<int:usuario_id>', methods=["DELETE"])
class DeletarUsuario(Resource):
    @usuario_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def delete(self, usuario_id):
        """
        Endpoint para deletar um usuário.
        """
        usuario_autenticado = int(get_jwt_identity())
        if usuario_id != usuario_autenticado:
            return {"mensagem": "Você só pode deletar sua própria conta."}, 403

        usuario = Usuario.query.get_or_404(usuario_id)

        # Deletar as avaliações associadas ao usuário
        Avaliacao.query.filter_by(usuario_id=usuario_id).delete()

        # Remover a associação dos livros cadastrados pelo usuário
        livros = Livro.query.filter_by(cadastrado_por=usuario_id).all()
        for livro in livros:
            livro.cadastrado_por = None

        # Deletar os favoritos do usuário
        UsuarioLivro.query.filter_by(id_usuario=usuario_id).delete()

        db.session.delete(usuario)
        db.session.commit()
        return {"mensagem": "Usuário deletado com sucesso!"}, 200

@livros_namespace.route('/cadastrar', methods=["POST"])
class CadastrarLivro(Resource):
    @livros_namespace.expect(cadastro_livro_modelo)
    @usuario_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def post(self):
        """
        Endpoint para cadastrar um novo livro. O usuário deve fornecer o nome e sinopse.
        """
        data = request.get_json()
        nome = data.get("nome")
        autor = data.get("autor")
        sinopse = data.get("sinopse")

        if not nome or not autor or not sinopse:
            return {"mensagem": "Nome, autor e sinopse são obrigatórios."}, 400
        
        # Verificação de sinopse válida
        if not sinopse_valida(sinopse):
            return {"mensagem": "A sinopse deve ter 10 ou mais caracteres"}, 400

        usuario_id = get_jwt_identity()

        livro = Livro(nome=nome, autor=autor, sinopse=sinopse, avaliacao=0, cadastrado_por=usuario_id)
        db.session.add(livro)
        db.session.commit()
        return {"mensagem": "Livro cadastrado com sucesso!"}, 201

@livros_namespace.route('/listar', methods=["GET"])
class ListarLivros(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def get(self): 
        """
        Endpoint para listar todos os livros.
        """
        usuario_id = int(get_jwt_identity())
        livros = Livro.query.all()

        # Obtém os IDs dos livros favoritados pelo usuário
        livros_favoritos_ids = {fav.id_livro for fav in UsuarioLivro.query.filter_by(id_usuario=usuario_id).all()}

        # Obtém os IDs das avaliações do usuário para verificar se ele já avaliou algum livro
        avaliacoes_usuario = {avaliacao.livro_id: avaliacao.id for avaliacao in Avaliacao.query.filter_by(usuario_id=usuario_id).all()}
        
        resultado = [
            {
                "id": livro.id,
                "nome": livro.nome,
                "autor": livro.autor,
                "sinopse": livro.sinopse,
                "avaliacao": livro.media_avaliacoes,
                "cadastrado_por": livro.usuario.nome if livro.usuario else None,
                "usuario_id": livro.usuario.id if livro.usuario else None,
                "favoritado": livro.id in livros_favoritos_ids,  
                "avaliado": avaliacoes_usuario.get(livro.id)
                
            }
            for livro in livros
        ]
        return resultado, 200

@livros_namespace.route("/<int:livro_id>", methods=["GET"])
class ObterLivroPorId(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def get(self, livro_id):
        """
        Endpoint para listar as informações de um livro a partir de seu ID.
        """
        livro = Livro.query.get(livro_id)
        if not livro:
            return {"mensagem": "Livro não encontrado"}, 404
        
        avaliacoes = [
            {
                "id": avaliacao.id,
                "nota": avaliacao.nota,
                "descricao": avaliacao.descricao,
            }
            for avaliacao in livro.avaliacoes
        ]

        return {
            "id": livro.id,
            "nome": livro.nome,
            "autor": livro.autor,
            "sinopse": livro.sinopse,
            "avaliacao": avaliacoes,
            "media_avaliacoes": livro.media_avaliacoes,
            "cadastrado_por": livro.usuario.nome if livro.usuario else None,
        }, 200
    
@livros_namespace.route("/<string:nome>", methods=["GET"])
class ObterLivroPorNome(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def get(self, nome):
        """
        Endpoint para obter um livro a partir do seu nome. O usuário deverá fornecer o nome do livro escolhido.
        """
        livros = Livro.query.filter(Livro.nome.ilike(f"%{nome}%")).all()
        
        if not livros:
            return {"mensagem": "Livro não encontrado"}, 404

        resultado = [
            {
                "id": livro.id,
                "nome": livro.nome,
                "autor": livro.autor,
                "sinopse": livro.sinopse,
                "avaliacao": [
                    {
                        "id": avaliacao.id,
                        "nota": avaliacao.nota,
                        "descricao": avaliacao.descricao,
                    }
                    for avaliacao in livro.avaliacoes  
                ],
                "media_avaliacoes": livro.media_avaliacoes,
                "cadastrado_por": livro.usuario.nome if livro.usuario else None,
            }
            for livro in livros
        ]

        return resultado, 200
    
@livros_namespace.route("/<int:livro_id>/avaliar", methods=["POST"])
class AvaliarLivro(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @livros_namespace.expect(avaliacao_modelo)
    @jwt_required()
    def post(self, livro_id):
        """
        Endpoint para avaliar um livro. O usuário deve fornecer informações 
        como descrição de forma opcional e a sua nota sendo de 0 a 5 obrigatoriamente.
        """
        data = request.get_json()
        usuario_id = int(get_jwt_identity())
        descricao = data.get("descricao")
        nota = int(data.get("nota"))


        livro = Livro.query.get(livro_id)
        if not livro:
            return {"mensagem": "Livro não encontrado"}, 404


        if not (0 <= nota <= 5):
            return {"mensagem": "A nota deve ser um número entre 0 e 5"}, 400
        
        if descricao and len(descricao) > 500:
            return {"mensagem": "A descrição deve ter no máximo 500 caracteres"}, 400


        avaliacao = Avaliacao(livro_id=livro_id, usuario_id=usuario_id, nota=nota, descricao=descricao)
        db.session.add(avaliacao)
        db.session.commit()

        media = livro.media_avaliacoes

        return {
            "mensagem": "Avaliação registrada com sucesso!",
            "livro": {
                "id": livro.id,
                "nome": livro.nome,
                "avaliacao": media
            }
        }, 201
    
@livros_namespace.route("/avaliacao/<int:avaliacao_id>", methods=["DELETE"])
class DeletarAvaliacao(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def delete(self, avaliacao_id):
        """
        Endpoint para excluir uma avaliação de um livro.
        """
        usuario_id = int(get_jwt_identity())
        avaliacao = Avaliacao.query.get(avaliacao_id)

        if not avaliacao:
            return {"mensagem": "Avaliação não encontrada"}, 404

        if avaliacao.usuario_id != usuario_id:
            return {"mensagem": "Você só pode deletar suas próprias avaliações."}, 403

        db.session.delete(avaliacao)
        db.session.commit()

        return {"mensagem": "Avaliação deletada com sucesso!"}, 200

@livros_namespace.route("/avaliacao/<int:livro_id>", methods=["GET"])
class ObterAvaliacaoUsuarioPorLivro(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def get(self, livro_id):
        """
        Endpoint para visualizar a avaliação de um usuário sobre um livro específico.
        O usuário deve fornecer o livro_id e o token JWT para acessar as informações.
        """
        usuario_id = int(get_jwt_identity())  

        # Verifica se a avaliação do usuário sobre o livro existe
        avaliacao = Avaliacao.query.filter_by(livro_id=livro_id, usuario_id=usuario_id).first()

        if not avaliacao:
            return {"mensagem": "Avaliação não encontrada para este livro."}, 404


        return {
            "id": avaliacao.id,
            "livro_id": livro_id,
            "usuario_id": usuario_id,
            "nota": avaliacao.nota,
            "descricao": avaliacao.descricao
        }, 200
    

    
@livros_namespace.route("/<int:livro_id>", methods=["DELETE"])
class DeletarLivro(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def delete(self, livro_id):
        """
        Endpoint para deletar um livro. O usuário deverá fornecer o id do livro escolhido,
        podendo deletar apenas seus próprios livros cadastrados.
        """
        usuario_id = int(get_jwt_identity())
        livro = Livro.query.get_or_404(livro_id)

        livro = Livro.query.get(livro_id)
        if not livro:
            return {"mensagem": "Livro não encontrado"}, 404

        if livro.cadastrado_por != usuario_id:
            return {"mensagem": "Você só pode deletar livros que cadastrou."}, 403

        # Deletar os registros de favoritos relacionados a este livro
        UsuarioLivro.query.filter_by(id_livro=livro_id).delete()

        db.session.delete(livro)
        db.session.commit()
        return {"mensagem": "Livro deletado com sucesso!"}, 200


@usuario_namespace.route("/favoritar/<int:livro_id>", methods=["POST"])
class FavoritarLivro(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def post(self, livro_id):
        """
        Endpoint para favoritar um livro. O usuário deverá fornecer o id do livro escolhido.
        """
        usuario_id = int(get_jwt_identity())
        if UsuarioLivro.query.filter_by(id_usuario=usuario_id, id_livro=livro_id).first():
            return {"mensagem": "Livro já favoritado"}, 400

        favorito = UsuarioLivro(id_usuario=usuario_id, id_livro=livro_id)
        db.session.add(favorito)
        db.session.commit()
        return {"mensagem": "Livro favoritado com sucesso!"}, 201

@usuario_namespace.route("/livros/favoritos", methods=["GET"])
class ListarLivrosFavoritos(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def get(self):
        """
        Endpoint para listar todos os livros favoritos de um usuário.
        """
        usuario_id = int(get_jwt_identity())
        favoritos = (
            UsuarioLivro.query
            .filter_by(id_usuario=usuario_id)
            .join(Livro, UsuarioLivro.id_livro == Livro.id)
            .all()
        )

        avaliacoes_usuario = {avaliacao.livro_id: avaliacao.id for avaliacao in Avaliacao.query.filter_by(usuario_id=usuario_id).all()}

        resultado = [
            {
                "id": favorito.livro.id,
                "nome": favorito.livro.nome,
                "autor": favorito.livro.autor,
                "sinopse": favorito.livro.sinopse,
                "avaliacao": favorito.livro.media_avaliacoes,
                "cadastrado_por": favorito.livro.usuario.nome if favorito.livro.usuario else None,
                "usuario_id": favorito.livro.usuario.id if favorito.livro.usuario else None,
                "favoritado": favorito.livro.id,  
                "avaliado": avaliacoes_usuario.get(favorito.livro.id)
            }
            for favorito in favoritos
        ]

        return resultado, 200

@usuario_namespace.route("/desfavoritar/<int:livro_id>", methods=["DELETE"])
class DesfavoritarLivro(Resource):
    @livros_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def delete(self, livro_id):
        """
        Endpoint para desfavoritar um livro.
        O usuário autenticado remove o livro de sua lista de favoritos.
        """
        usuario_id = int(get_jwt_identity())

        livro = Livro.query.get(livro_id)
        if not livro:
            return {"mensagem": "Livro não encontrado"}, 404

        usuario_livro = UsuarioLivro.query.filter_by(id_usuario=usuario_id, id_livro=livro_id).first()
        if not usuario_livro:
            return {"mensagem": "Este livro não está favoritado pelo usuário."}, 400

        db.session.delete(usuario_livro)
        db.session.commit()

        return {"mensagem": "Livro desfavoritado com sucesso!"}, 200