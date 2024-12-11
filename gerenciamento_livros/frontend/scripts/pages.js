const pages = {
    cadastrar: `
    <div class="cadastro-page">
        <div class="cadastro-container">
            <h2>Cadastro de Usuário</h2>
            <form id="cadastroForm" class="cadastro-form">
                <input type="text" id="nome" placeholder="Nome Completo" required class="input-medium"/>
                <input type="email" id="email" placeholder="Email" required class="input-medium"/>
                <input type="password" id="senha" placeholder="Senha" required class="input-medium"/>
                <input type="password" id="confirmarSenha" placeholder="Confirmar Senha" required class="input-medium"/>
                <button type="submit" class="btn">Cadastrar</button>
            </form>
            <a href="#/login" id="link-login" class="link-login">Já tem uma conta? Faça login</a>
        </div>
    </div>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fa;
            height: 100vh;
            margin: 0;
        }

        .cadastro-page {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 8rem;
        }

        .cadastro-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 500px;
            text-align: center;
            margin-right: 5rem;
        }

        h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .input-medium {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .input-medium:focus {
            border-color: #4CAF50;
            outline: none;
        }

        .btn {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-bottom: 1rem;
        }

        .btn:hover {
            background-color: #45a049;
        }

        #link-login {
            list-style: none;
            color: black;
            text-decoration: none;
        }

        #link-login:hover {
            text-decoration: underline;
        }

    </style>`,

    login: `
    <div class="login-page">
        <div class="login-container">
            <h2>Biblioteca Online</h2>
            <form id="loginForm" class="login-form">
                <input type="email" id="email" placeholder="Email" required class="input-medium"/>
                <input type="password" id="senha" placeholder="Senha" required class="input-medium"/>
                <button type="submit" class="btn">Entrar</button>
            </form>
            <a href="#/cadastro" id="link-cadastro" class="link-cadastro">Crie uma conta</a>
        </div>
    </div>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fa;
            height: 100vh;
            margin: 0;
        }
            
        .login-page {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 8rem;
        }

        .login-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 500px;
            text-align: center;
            margin-right: 5rem;
        }

        h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .input-medium {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .input-medium:focus {
            border-color: #4CAF50;
            outline: none;
        }

        .btn {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-bottom: 1rem;
        }

        .btn:hover {
            background-color: #45a049;
        }
            
        #link-cadastro {
            list-style: none;
            color: black;
            text-decoration: none;
        }
        #link-cadastro:hover {
            text-decoration: underline;
        }

    </style>`,

    favoritos: `
    <div class="favoritos-title">
        <h1>Seus livros favoritos ❤️</h1>
    </div>

    <div id="livrosContainer" class="livros-container">
        <!-- Aqui os livros serão exibidos dinamicamente como cards -->
    </div>

    <!-- Modal para avaliação -->
    <div id="modalAvaliacao" class="modal-avaliacao">
        <div class="modal-content">
            <span class="close-modal" id="closeModal">&times;</span>
            <h2>Avaliar Livro</h2>
            <form id="formAvaliacao">
                <label for="comentario">Comentário:</label>
                <textarea id="comentario" rows="4" required></textarea>
                
                <label for="nota">Nota:</label>
                <select id="nota" required>
                    <option value="">Selecione uma nota</option>
                    <option value="1">1 - Péssimo</option>
                    <option value="2">2 - Ruim</option>
                    <option value="3">3 - Regular</option>
                    <option value="4">4 - Bom</option>
                    <option value="5">5 - Excelente</option>
                </select>
                
                <button type="submit" class="btn">Enviar Avaliação</button>
            </form>
        </div>
    </div>

    
    <!-- Modal de Visualização de Avaliação -->
    <div id="modalVerAvaliacao" class="modal-avaliacao">
        <div class="modal-content">
            <span class="close-modal" id="close-modal">&times;</span>
            <h2>Avaliação do Livro</h2>
            <div class="stars" id="stars"></div>
            <p><strong>Comentário:</strong></p>
            <p class="comentario-ver-avaliacao" id="comentarioAvaliacao"></p>
            <div class="acoes-visualizar-avaliacao">
                <span class="btn-avaliacao-deletar">&#128465;</span>
            </div>
        </div>
    </div>

    <style>
    .favoritos-title {
        display: flex;
        justify-content: center;
        cursor: default;
    }
    .livros-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding: 20px;
        }

        .livro-card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 300px;
            margin: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .livro-card:hover {
            transform: scale(1.05); 
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);  
        }

        .livro-card h3 {
            font-size: 20px;
            color: #333;
        }

        .livro-card p {
            font-size: 14px;
            color: #555;
            margin-bottom: 8px;
        }

        .livro-info strong {
            font-weight: bold;
        }

        .btn-avaliacao-deletar {
            font-size: 40px;
            color: red; 
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }
        
        .btn-avaliacao-deletar:hover {
            transform: scale(1.3);
        }

        .deletar-btn {
            position: absolute;
            top: 44px;
            right: 7.6px;
            font-size: 34px;
            color: red; 
            cursor: pointer;
            transition: color 0.3s ease;
            background: transparent;
            border: none;
            transition: transform 0.2s ease-in-out;
        }

        .deletar-btn:hover {
            transform: scale(1.2);
        }

        .favoritar {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            color: #cdcbcb; 
            cursor: pointer;
            transition: color 0.3s ease;
            transition: transform 0.2s ease-in-out;
        }

        .favoritar:hover {
            color: #ffcc00; 
            transform: scale(1.4);
        }

        .favoritado {
            color: #ffcc00; 
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-conteudo {
            background-color: #fff;
            margin: 15% auto;
            padding: 20px;
            width: 80%;
            max-width: 500px;
        }

        .stars span {
            font-size: 34px;
            color: gold;
            cursor: default;
        }
        
        .stars {
            display: flex;
            justify-content: center;
        }
        
        .comentario-ver-avaliacao {
            display: flex;
            justify-content: center;
        }

        .modal-avaliacao {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .close-modal {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 32px;
            cursor: pointer;
        }

        .modal-content h2 {
            display: flex;
            justify-content: center;
        }

        .modal-content label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .modal-content textarea {
            width: 95%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .modal-content select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .modal-content .btn {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }

        .modal-content .btn:hover {
            background-color: #45a049;
        }

        .acoes-visualizar-avaliacao {
            display: flex;
            justify-content: right;
        }

        .botao {
            background-color: #4CAF50;  
            color: white;               
            padding: 10px 20px;         
            border: none;               
            border-radius: 5px;         
            font-size: 16px;            
            cursor: pointer;           
            transition: background-color 0.3s ease; 
        }

        .botao:hover {
            background-color: #45a049;  
        }

        .ver-avaliacao {
            background-color: #007bff;  
        }

        .ver-avaliacao:hover {
            background-color: #0056b3;  
        }

        .avaliar-btn {
            background-color: #f39c12; 
        }

        .avaliar-btn:hover {
            background-color: #e67e22; 
        }

    </style>
    `,
    
    livros: `
    <div id="livrosContainer" class="livros-container">
        <!-- Aqui os livros serão exibidos dinamicamente como cards -->
    </div>

    <!-- Modal para avaliação -->
    <div id="modalAvaliacao" class="modal-avaliacao">
        <div class="modal-content">
            <span class="close-modal" id="closeModal">&times;</span>
            <h2>Avaliar Livro</h2>
            <form id="formAvaliacao">
                <label for="comentario">Comentário:</label>
                <textarea id="comentario" rows="4" required></textarea>
                
                <label for="nota">Nota:</label>
                <select id="nota" required>
                    <option value="">Selecione uma nota</option>
                    <option value="1">1 - Péssimo</option>
                    <option value="2">2 - Ruim</option>
                    <option value="3">3 - Regular</option>
                    <option value="4">4 - Bom</option>
                    <option value="5">5 - Excelente</option>
                </select>
                
                <button type="submit" class="btn">Enviar Avaliação</button>
            </form>
        </div>
    </div>

    
    <!-- Modal de Visualização de Avaliação -->
    <div id="modalVerAvaliacao" class="modal-avaliacao">
        <div class="modal-content">
            <span class="close-modal" id="close-modal">&times;</span>
            <h2>Avaliação do Livro</h2>
            <div class="stars" id="stars"></div>
            <p><strong>Comentário:</strong></p>
            <p class="comentario-ver-avaliacao" id="comentarioAvaliacao"></p>
        <div class="acoes-visualizar-avaliacao">
         <span class="btn-avaliacao-deletar">&#128465;</span>
        </div>
           
        </div>
    </div>

    <style>
        .livros-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            padding: 20px;
        }

        .livro-card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 300px;
            margin: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .livro-card:hover {
            transform: scale(1.05); 
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);  
        }

        .livro-card h3 {
            font-size: 20px;
            color: #333;
        }

        .livro-card p {
            font-size: 14px;
            color: #555;
            margin-bottom: 8px;
        }

        .livro-info strong {
            font-weight: bold;
        }

        .favoritar {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            color: #cdcbcb; 
            cursor: pointer;
            transition: color 0.3s ease;
            transition: transform 0.2s ease-in-out;
        }

        .btn-avaliacao-deletar {
            font-size: 40px;
            color: red; 
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }
        
        .btn-avaliacao-deletar:hover {
            transform: scale(1.3);
        }

        .deletar-btn {
            position: absolute;
            top: 44px;
            right: 7.6px;
            font-size: 34px;
            color: red; 
            cursor: pointer;
            transition: color 0.3s ease;
            background: transparent;
            border: none;
            transition: transform 0.2s ease-in-out;
        }

        .deletar-btn:hover {
            transform: scale(1.2);
        }

        .favoritar:hover {
            color: #ffcc00; 
            transform: scale(1.4);
        }

        .favoritado {
            color: #ffcc00; 
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-conteudo {
            background-color: #fff;
            margin: 15% auto;
            padding: 20px;
            width: 80%;
            max-width: 500px;
        }

        .stars span {
            font-size: 34px;
            color: gold;
            cursor: default;
        }
        
        .stars {
            display: flex;
            justify-content: center;
        }
        
        .comentario-ver-avaliacao {
            display: flex;
            justify-content: center;
        }

        .modal-avaliacao {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .close-modal {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 32px;
            cursor: pointer;
        }

        .modal-content h2 {
            display: flex;
            justify-content: center;
        }

        .modal-content label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .modal-content textarea {
            width: 95%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .modal-content select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .modal-content .btn {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }

        .modal-content .btn:hover {
            background-color: #45a049;
        }

        .acoes-visualizar-avaliacao {
            display: flex;
            justify-content: right;
        }

        .botao {
            background-color: #4CAF50;  
            color: white;               
            padding: 10px 20px;         
            border: none;               
            border-radius: 5px;         
            font-size: 16px;            
            cursor: pointer;           
            transition: background-color 0.3s ease; 
        }

        .botao:hover {
            background-color: #45a049;  
        }

        .ver-avaliacao {
            background-color: #007bff;  
        }

        .ver-avaliacao:hover {
            background-color: #0056b3;  
        }

        .avaliar-btn {
            background-color: #f39c12; 
        }

        .avaliar-btn:hover {
            background-color: #e67e22; 
        }

    </style>`,

    cadastrarLivro: `

    <!-- Modal para cadastro de livro -->
    <div id="modalCadastroLivro" class="modal-cadastro-livro">
        <div class="modal-content">
            <span class="close-modal-cadastro-livro" id="closeModalCadastro">&times;</span>
            <h2>Cadastrar Livro</h2>
            <form id="formCadastroLivro">
                <input type="text" id="nome" placeholder="Título do Livro" required class="input-medium"/>
                <input type="text" id="autor" placeholder="Autor" required class="input-medium"/>
                <textarea placeholder="Sinopse" id="sinopse" rows="4" maxlength="255" required class="input-medium"></textarea>
                <button type="submit" class="btn">Cadastrar</button>
            </form>
        </div>
    </div>

    <style>
        .modal-cadastro-livro {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .modal-content h2 {
            display: flex;
            justify-content: center;
        }

        .modal-content textarea {
            width: 95%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .close-modal-cadastro-livro{
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            cursor: pointer;
            color: #555;
            transition: color 0.3s;
        }

        .close-modal-cadastro-livro:hover {
            color: #f44336;
        }

        .input-medium {
            width: 93%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .input-medium:focus {
            border-color: #4CAF50;
            outline: none;
        }

        .btn {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-bottom: 1rem;
        }

        .btn:hover {
            background-color: #45a049;
        }

    </style>`
};