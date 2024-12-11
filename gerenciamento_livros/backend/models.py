from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.orm import relationship
from sqlalchemy import func

db = SQLAlchemy()
bcrypt = Bcrypt()

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    senha = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def __init__(self, nome, email, senha, role):
        self.nome = nome
        self.email = email
        self.senha = bcrypt.generate_password_hash(senha).decode('utf-8')
        self.role = role 


class Livro(db.Model):
    __tablename__ = "livros"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    autor = db.Column(db.String(255), nullable=False)
    sinopse = db.Column(db.String(255), nullable=False)
    avaliacao = db.Column(db.Integer, nullable=False, default=0)
    cadastrado_por = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=True)

    # Relacionamento com o modelo Usuario
    usuario = db.relationship("Usuario", backref="livros_cadastrados", lazy=True)

    # Relacionamento com Avaliacao
    avaliacoes = db.relationship("Avaliacao", back_populates="livro", cascade="all, delete-orphan")

    @property
    def media_avaliacoes(self):
        # Calcula a média diretamente com SQLAlchemy
        media = db.session.query(func.avg(Avaliacao.nota)).filter(Avaliacao.livro_id == self.id).scalar()
        return round(media, 2) if media else 0


class Avaliacao(db.Model):
    __tablename__ = "avaliacoes"

    id = db.Column(db.Integer, primary_key=True)
    livro_id = db.Column(db.Integer, db.ForeignKey('livros.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    descricao = db.Column(db.String(255), nullable=True)
    nota = db.Column(db.Integer, nullable=False)

    # Relacionamentos
    livro = db.relationship("Livro", back_populates="avaliacoes")
    usuario = db.relationship("Usuario", backref="avaliacoes")

class UsuarioLivro(db.Model):
    __tablename__ = "usuario_livro"

    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuarios.id"))
    id_livro = db.Column(db.Integer, db.ForeignKey("livros.id"))

    # Relacionamentos
    usuario = db.relationship("Usuario", backref="livros_favoritos")
    livro = db.relationship("Livro", backref="usuarios_favoritos")
    
