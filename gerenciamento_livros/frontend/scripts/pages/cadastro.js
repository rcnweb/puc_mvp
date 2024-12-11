const apiCadastro = 'http://localhost:5000/usuarios/cadastrar';

// Função para renderizar a página de cadastro
function renderCadastro() {
    const form = document.getElementById('cadastroForm');
    
    if (!form) {
        exibirMensagem('Formulário de cadastro não encontrado!', 'error');
        return;
    }

    if (form._listenerAdded) {
        return; 
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            exibirMensagem('As senhas não coincidem!', 'error');
            return;
        }

        try {
            const response = await fetch(`${apiCadastro}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                exibirMensagem('Cadastro bem-sucedido!', 'success');
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 1000);
            } else {
                exibirMensagem(data.mensagem, 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            exibirMensagem('Erro na requisição:' + error.message);
        }
    });
    form._listenerAdded = true;
}

// Função para configurar a página de cadastro
function setupCadastroForm() {
    const page = routes[window.location.hash] || 'cadastro';
    if (page === 'cadastro') {
        renderCadastro();
    }
}

document.addEventListener('DOMContentLoaded', setupCadastroForm);
