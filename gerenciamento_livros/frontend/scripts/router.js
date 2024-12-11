const routes = {
    '#/login': 'login',
    '#/livros': 'livros',
    '#/livros/cadastrar': 'cadastrarLivro',
    '#/cadastro': 'cadastrar',
    '#/favoritos': 'favoritos'
};

function checkAuthentication() {
    const token = sessionStorage.getItem('token');
    const currentHash = window.location.hash;

    if (!token && currentHash !== '#/login' && currentHash !== '#/cadastro') {
        window.location.hash = '#/login'; 
    }

    if (token && currentHash === '#/login') {
        window.location.hash = '#/livros';
    }

    if (token && currentHash === '#/cadastro') {
        window.location.hash = '#/livros';
    }
}

document.addEventListener('DOMContentLoaded', checkAuthentication);

function loadPage(page) {
    const content = pages[page] || pages['login'];
    document.getElementById('app').innerHTML = content;

    if (page === 'login') {
        setTimeout(() => {
            setupLoginForm();
        }, 50)
    }

    if (page === 'livros') {
        setTimeout(() => {
            setupLivrosPage();
        }, 50)
    }

    if (page === 'cadastrarLivro') {
        setTimeout(() => {
            openModalCadastroLivro();
        }, 50)
    }

    if (page === 'cadastrar') {
        setTimeout(() => {
            renderCadastro();
        }, 50)
    }

    if (page === 'favoritos') {
        setTimeout(() => {
            setupFavoritosPage();
        }, 50)
    }

    checkAuthentication();
    setTimeout(() => {
        loadNavItems();
    }, 50)
}

function setupRouter() {
    window.addEventListener('hashchange', () => {
        const page = routes[window.location.hash] || 'login';
        loadPage(page);
    });

    window.addEventListener('DOMContentLoaded', () => {
        const page = routes[window.location.hash] || 'login';
        loadPage(page);
    });

    const initialPage = routes[window.location.hash] || 'login';
    loadPage(initialPage);
}

setupRouter();
