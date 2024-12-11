const apiLogin = 'http://localhost:5000/usuarios/login';

// Função para renderizar a página de login
function renderLogin() {
    const form = document.getElementById('loginForm');
    
    if (!form) {
        exibirMensagem('Formulário de login não encontrado!', 'error');
        return;
    }

    if (form._listenerAdded) {
        return; 
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {

            const response = await fetch(`${apiLogin}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('token', data.access_token);
                exibirMensagem('Login bem-sucedido!', 'success')
                setTimeout(() => {
                    window.location.href = '#/livros';
                }, 1000)
            } else {
                exibirMensagem(data.mensagem, 'error')
            }
        } catch (error) {
            console.error('Erro:', error);
            exibirMensagem('Erro na requisição:' + error.message)
        }
    });
    form._listenerAdded = true;
}


function setupLoginForm() {
    const page = routes[window.location.hash] || 'login';
    if (page === 'login') {
        renderLogin();
    }
}

document.addEventListener('DOMContentLoaded', setupLoginForm);


