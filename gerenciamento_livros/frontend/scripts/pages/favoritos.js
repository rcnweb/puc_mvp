const apiLivrosFavoritos = 'http://localhost:5000/usuarios/livros/favoritos';


// Função para renderizar a página favoritos.

function renderFavoritos() {
    const livrosContainer = document.getElementById('livrosContainer');
    livrosContainer.innerHTML = '<p>Carregando livros...</p>'; 

    fetch(`${apiLivrosFavoritos}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {

            livrosContainer.innerHTML = '';


            data.forEach(livro => {
                const livroCard = document.createElement('div');
                livroCard.classList.add('livro-card');

                const isOwner = livro.usuario_id === getUserId();

                // Trunca a sinopse e adiciona o tooltip se for maior que 20 caracteres
                let sinopseExibida = livro.sinopse;
                let sinopseTooltip = '';
                if (livro.sinopse.length > 50) {
                    sinopseExibida = livro.sinopse.substring(0, 50) + '...';
                    sinopseTooltip = `data-tooltip-sinopse="${livro.sinopse}"`;
                }

                let tooltipFavoritar = livro.favoritado ? "Desfavoritar" : "Favoritar";

                livroCard.innerHTML = `
                    <div class="livro-info">
                        <h3>${livro.nome}</h3>
                        <p><strong>Avaliação:</strong> ${livro.avaliacao}</p>
                        <p><strong>Cadastrado por:</strong> ${livro.cadastrado_por || 'Desconhecido'}</p>
                        <p><strong>Autor:</strong> ${livro.autor}</p>
                        <p class="sinopse" ${sinopseTooltip}><strong>Sinopse:</strong> ${sinopseExibida}</p>
                    </div>
                    <div class="acoes">
                        <span class="favoritar ${livro.favoritado ? 'favoritado' : ''}" data-id="${livro.id}" data-tooltip="${tooltipFavoritar}">&#9733;</span>
                        ${isOwner ? `<span class="deletar-btn" data-id="${livro.id}" data-tooltip="Deletar">&#128465;</span>` : ''}
                        ${livro.avaliado ? `<button class="botao ver-avaliacao" data-id="${livro.id}">Ver sua avaliação</button>` : `<button class="botao avaliar-btn" data-id="${livro.id}">Avaliar</button>`}
                    </div>
                `;
                livrosContainer.appendChild(livroCard);
            });

            
            // Evento de click para favoritar um livro
            document.querySelectorAll('.favoritar').forEach(star => {
                star.addEventListener('click', function() {
                    const elemento = event.target;
                    const livroId = this.getAttribute('data-id');
            
                    if (elemento.classList.contains('favoritado')) {
                        desfavoritarLivro(livroId);
                        elemento.classList.remove('favoritado');
                        setTimeout(() => {
                            renderFavoritos()
                        }, 100);
                    } 
                });
            });

            // Evento de click para abrir modal de visualizar avaliação
            document.querySelectorAll('.ver-avaliacao').forEach(btn => {
                btn.addEventListener('click', function() {
                    const livroId = this.getAttribute('data-id');
                    const livro = data.find(livro => livro.id == livroId); 
            
                    if (livro && livro.avaliado) {
                        openVerAvaliacao(livroId); 
                    } else {
                        exibirMensagem('Avaliação não encontrada.', 'error');
                    }
                });
            });

            // Evento de click para deletar livro
            document.querySelectorAll('.deletar-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const livroId = this.getAttribute('data-id');
                    deletarLivroFav(livroId);
                });
            });

        } else {
            document.getElementById('livrosContainer').innerHTML = 'Nenhum livro encontrado.';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar os livros:', error);
        const livrosContainer = document.getElementById('livrosContainer');
        if (livrosContainer) {
            livrosContainer.innerHTML = 'Erro ao carregar os livros. Tente novamente mais tarde.';
        } else {
            console.error('Elemento livrosContainer não encontrado');
        }
    });
}

// Função para renderizar a página de favoritos caso o usuário esteja na url da página.
function setupFavoritosPage() {
    const hash = window.location.hash; 
    if (hash === '#/favoritos') { 
        renderFavoritos(); 
    }
}

// Função para desfavoritar um livro.

async function desfavoritarLivro(livroId) {
    try {
        const response = await fetch(`${apiDesfavoritar}/${livroId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            exibirMensagem(data.mensagem, 'success');
        } else {
            exibirMensagem(data.mensagem, 'error');
        }
    } catch (error) {
        console.error('Erro ao desfavoritar o livro:', error);
        exibirMensagem('Erro ao desfavoritar o livro. Tente novamente mais tarde.', 'error');
    }
}

function deletarLivroFav(livroId) {
    fetch(`${apiLivros}/${livroId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem === "Livro deletado com sucesso!") {
            exibirMensagem(data.mensagem, 'sucesso');
            renderFavoritos();
        } else {
            exibirMensagem(data.mensagem, 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao deletar o livro:', error);
        exibirMensagem('Erro ao deletar o livro. Tente novamente mais tarde.', 'error');
    });
}

document.addEventListener('DOMContentLoaded', setupFavoritosPage);

