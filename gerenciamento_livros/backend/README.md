# Python Flask
<p align="center">
  <img src="https://github.com/innovatorved/python-flask/blob/master/image.png?raw=true" alt="flask image"/>
</p>




O Flask é um framework web leve e flexível para Python, utilizado para desenvolver aplicações web. 
  Ele é conhecido por sua simplicidade e facilidade de uso, o que o torna ideal para projetos pequenos a médios, mas também pode ser escalado para aplicações mais complexas.

## Sobre a API
  É uma API que lida com o gerenciamento de livros, como uma biblioteca online. Nela você poderá se cadastrar como usuário, logar, favoritar livros, excluir e cadastrar livros e entre outras coisas.

## Swagger
  A api desenvolvida contém de forma funcional todos endpoints (rotas) criadas com o Flask, <br>
  acesse a url padrão
  ```bash
    http://127.0.0.1:5000/swagger
  ```



Para testar as rotas deverá se autenticar inserindo o token de acesso, <br>


## Instalação 
Clone o repositório com o comando abaixo.
  ```bash 
   git clone https://github.com/rcnweb/puc_mvp/tree/main/gerenciamento_livros/backend
  ```

## Requisitos
  - É necessario utilizar a versão do 3.13.1 do Python. 
  - Crie um ambiente virtual (opcional).
  ```bash 
    python -m venv venv
  ```
  - Instale os requisitos do arquivo requirements.txt. <br>
    Arquivo requirements.txt
    ```bash
      Flask==2.2.5
      Flask-SQLAlchemy==3.0.3
      Flask-Bcrypt==1.0.1
      Flask-JWT-Extended==4.4.4
      Flask-Cors==5.0.0
      Flask-restplus
    ```
  ```bash 
    pip install -r requirements.txt
  ```

## Executando a aplicação
Agora para executar a apliacação, com uma IDE de sua escolha seja o VSCode ou o próprio PyCharm.
  Execute a aplicação principal app.py com o comando
  ```bash
    python app.py
  ```
ou
```bash
  flask run
```
a aplicação irá iniciar na porta 127.0.0.1:5000
