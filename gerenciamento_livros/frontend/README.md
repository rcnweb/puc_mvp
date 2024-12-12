# Gerenciamento de Livros SPA (Single Page Application)



## Regras seguidas
  Tive que tentar seguir inúmeras regras dentre elas
  - Não utilizar servidores locais.
  - Nao utilizar nenhuma dependência externa ou extensões.
  - Rodar a aplicação em perfeito estado a partir do index.html diretamente no navegador.

  Sobre as regras, o que mais dificultou foi o desenvolvimento sem servidor local, ainda mais se tratando de uma SPA, <br>
  tive que utilizar a location.hash ao invés da href para não recarregar as páginas, e injetar o html de cada página especifica com Javascript vanilla

## Requisitos 
  Estar rodando a api feita com Flask em Python 
  - [backend](https://github.com/rcnweb/puc_mvp/tree/main/gerenciamento_livros/backend)

# Como rodar a aplicação
  É necessário desabilitar a segurança de cors do seu navegador, irei utilizar o chrome como exemplo.

## Windows
  - Abra o CMD como administrador 
  - Navegue até o diretório onde o Chrome está instalado (normalmente, em C:\Program Files\Google\Chrome\Application) e execute o seguinte comando:
  ```bash
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\chrome_dev"
  ```
   - --disable-web-security: Desativa as restrições de segurança CORS.
   - --user-data-dir="C:\chrome_dev": Especifica um diretório temporário para dados de perfil, necessário para iniciar o Chrome com essas configurações de segurança desativadas.

## Linux
  - Abra o terminal.
  - Execute o Chrome com o parâmetro de desativação de CORS:
  ```bash
    google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
  ```
Ou, se o Chrome não estiver no seu PATH, use o caminho completo do executável, por exemplo:
  ```bash
    /usr/bin/google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
  ```
  - --disable-web-security: Desativa as restrições de segurança CORS.
  - --user-data-dir="/tmp/chrome_dev": Cria um diretório temporário para o perfil de usuário.

## MacOS
  - Abra o terminal.
  - Execute o Chrome com o parâmetro de desativação de CORS:
  ```bash
    open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"
  ```
  - --disable-web-security: Desativa as restrições de segurança CORS.
  - --user-data-dir="/tmp/chrome_dev": Define um diretório temporário para o perfil de dados do Chrome.

# Aplicação
Agora para rodar a aplicação basta abrir o arquivo index.html diretamente no navegador. <br>

<br>

Caso opte por não seguir as regras e deseja instalar um servidor local para ter mais facilidade, <br>
instale o live-server com o comando: <br>
```bash
  npm install live-server
```
e execute com o comando:
```bash
  live-server
```

# Favoritos
![image](https://github.com/user-attachments/assets/229e7650-f3f2-4498-a873-860e64299c3f)

# Cadastrar Livros
![image](https://github.com/user-attachments/assets/8fc10c00-1363-4595-bac9-9f4032225e06)

