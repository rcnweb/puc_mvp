const apiLivros = 'http://localhost:5000/livros';
const apiFavoritar = 'http://localhost:5000/usuarios/favoritar';
const apiDesfavoritar = 'http://localhost:5000/usuarios/desfavoritar';

// Renderiza o html da página de livros
function renderLivros() {
    const livrosContainer = document.getElementById('livrosContainer');
    livrosContainer.innerHTML = '<p>Carregando livros...</p>'; 

    fetch(`${apiLivros}/listar`, {
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
                    } else {
                        favoritarLivro(livroId);
                        elemento.classList.add('favoritado');
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
                    deletarLivro(livroId);
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

// Caso a rota esteja na página de livros renderiza a página.

function setupLivrosPage() {
    const hash = window.location.hash; 
    if (hash === '#/livros') { 
        renderLivros(); 
    }
}


// Função para desfavoritar um livro

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

// Função para favoritar um livro

async function favoritarLivro(livroId) {
    try {
        const response = await fetch(`${apiFavoritar}/${livroId}`, {
            method: 'POST',
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
        console.error('Erro ao favoritar o livro:', error);
        exibirMensagem('Erro ao favoritar o livro. Tente novamente mais tarde.', 'error');
    }
}


// Função para abrir o modal de avaliação
let livroSelecionadoId = null;
function openAvaliacaoModal(livroId) {

    const modalVerAvaliacao = document.getElementById('modalVerAvaliacao');
    const modalAvaliacao = document.getElementById('modalAvaliacao');
    

    if (modalVerAvaliacao.style.display === 'flex') {
        modalAvaliacao.style.display = 'none';
    } else {
        modalAvaliacao.style.display = 'flex'; 
        document.getElementById('formAvaliacao').addEventListener('submit', (event) => {
            event.preventDefault();
            enviarAvaliacao(livroId);
        
            fecharModal();
        }, {once: true});
    }
}

function fecharModal() {
    document.getElementById('modalAvaliacao').style.display = 'none';
    livroSelecionadoId = null;
    document.getElementById('nota').value = '';
    document.getElementById('comentario').value = ''
}

function enviarAvaliacao(livroId) {
    const nota = document.getElementById('nota').value;
    const descricao = document.getElementById('comentario').value;
    const currentHash = window.location.hash;

    fetch(`${apiLivros}/${livroId}/avaliar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nota, descricao })
    })
    .then(response => response.json())
    .then(data => {
        exibirMensagem(data.mensagem, 'success');
        fecharModal();
        if (currentHash === '#/favoritos') {
            renderFavoritos();
        } else {
            renderLivros();
        }
    })
    .catch(error => {
        console.error('Erro ao enviar a avaliação:', error);
        exibirMensagem('Erro ao enviar a avaliação. Tente novamente mais tarde.', 'error');
    });
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-modal')) {
        fecharModal();
    }
})

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('avaliar-btn')) {
        const livroId = event.target.closest('.livro-card').querySelector('.favoritar').getAttribute('data-id');
        openAvaliacaoModal(livroId);
    }
})


// Função para visualizar a avaliação

function openVerAvaliacao(livroId) {
    const modal = document.getElementById('modalVerAvaliacao');
    modal.style.display = 'flex';  
    obterAvaliacao(livroId);
}

let avaliacaoId = null;

function obterAvaliacao(livroId) {
    fetch(`${apiLivros}/avaliacao/${livroId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        if (data.nota != null && data.descricao) {
            avaliacaoId = data.id;

            document.getElementById('comentarioAvaliacao').textContent = data.descricao;


            const estrelas = document.getElementById('stars');
            estrelas.innerHTML = ''; 
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                if (i <= data.nota) {
                    star.textContent = '★'; 
                } else {
                    star.textContent = '☆'; 
                }
                estrelas.appendChild(star);
            }

            document.getElementById('modalVerAvaliacao').style.display = 'flex';
        } else {
            exibirMensagem("Avaliação não encontrada", 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar a avaliação:', error);
        exibirMensagem('Erro ao carregar a avaliação. Tente novamente mais tarde.', 'error');
    });
}

function fecharModalVerAvaliacao() {
    document.getElementById('modalVerAvaliacao').style.display = 'none';
    avaliacaoId = null;
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-modal')) {
        fecharModalVerAvaliacao();
    }
})


// Função para deletar avaliação

function deletarAvaliacao() {
    if (avaliacaoId === null) {
        exibirMensagem("Avaliação não encontrada.", 'error');
        return;
    }

    const currentHash = window.location.hash;

    fetch(`${apiLivros}/avaliacao/${avaliacaoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem === "Avaliação deletada com sucesso!") {
            exibirMensagem("Avaliação deletada com sucesso!", 'success');
            document.getElementById('modalVerAvaliacao').style.display = 'none';
            fecharModal();
            if (currentHash === '#/favoritos') {
                renderFavoritos();
            } else {
                renderLivros();
            }
        } else {
            exibirMensagem(data.mensagem, 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao deletar a avaliação:', error);
        exibirMensagem('Erro ao deletar a avaliação. Tente novamente mais tarde.', 'error');
    });
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-avaliacao-deletar')) {
        deletarAvaliacao();
    }
})


// Função para deletar um livro.

function deletarLivro(livroId) {
    const currentHash = window.location.hash;

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
            if (currentHash === '#/favoritos') {
                renderFavoritos();
            } else {
                renderLivros();
            }
        } else {
            exibirMensagem(data.mensagem, 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao deletar o livro:', error);
        exibirMensagem('Erro ao deletar o livro. Tente novamente mais tarde.', 'error');
    });
}


// Função para abrir modal de cadastro de livros.

function openModalCadastroLivro() {
    const modal = document.getElementById('modalCadastroLivro');
    modal.style.display = 'flex';

    document.getElementById('formCadastroLivro').addEventListener('submit', function(event) {
        event.preventDefault();
        cadastrarLivro();
    });
}

function fecharModalCadastroLivro() {
    const modal = document.getElementById('modalCadastroLivro');
    modal.style.display = 'none';
    window.location.hash = '#/livros';
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-modal-cadastro-livro')) {
        fecharModalCadastroLivro();
    }
})

function cadastrarLivro() {
    const nome = document.getElementById('nome').value;
    const autor = document.getElementById('autor').value;
    const sinopse = document.getElementById('sinopse').value;

    fetch(`${apiLivros}/cadastrar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome, autor, sinopse})
    })
    .then(response => {
        return response.json().then(data => {
            if (response.ok) {  
                exibirMensagem(data.mensagem, 'success');
                setTimeout(() => {
                    renderLivros(); 
                }, 50)
                fecharModalCadastroLivro(); 
            } else {  
                exibirMensagem(data.mensagem || 'Erro desconhecido', 'error');
            }
        });
    })
    .catch(error => {
        console.error('Erro ao cadastrar o livro:', error);
        exibirMensagem('Erro ao cadastrar o livro. Tente novamente mais tarde.', 'error');
    });
}

