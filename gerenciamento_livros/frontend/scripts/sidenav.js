const navData = [
    { label: 'Login', routeLink: '#/login', icon: '🔑' },
    { label: 'Livros', routeLink: '#/livros', icon: '📚' },
    { label: 'Favoritos', routeLink: '#/favoritos', icon: '❤️' },
    { label: 'Cadastrar Livro', routeLink: '#/livros/cadastrar', action: 'openModal', icon: '➕' },
    { label: 'Registro', routeLink: '#/cadastro', icon: '➕' },
    { label: 'Logout', routeLink: '#/login', icon: '🚪'}
];

function loadNavItems() {
    const navItemsContainer = document.getElementById('navItems');
    navItemsContainer.innerHTML = ''; 
    const hasSessionToken = getToken();
    
        const filteredNavData = navData.filter(item => {
            const link = document.createElement('a');
            link.classList.add('sidenav-nav-link');
            const navItem = document.createElement('div');
            navItem.classList.add('sidenav-nav-item');
            if (item.label === 'Livros' || item.label === 'Favoritos' || item.label === 'Cadastrar Livro') {
                return !!hasSessionToken;
            }

            if (item.label === 'Login' || item.label === 'Registro') {
                return !hasSessionToken;
            }

            if (item.label === 'Logout') {
                return hasSessionToken;
            }

        return true; 

    });
    
    filteredNavData.forEach(data => {
        const navItem = document.createElement('div');
        navItem.classList.add('sidenav-nav-item');

        const link = document.createElement('a');
        link.classList.add('sidenav-nav-link');
        link.href = data.routeLink; 


        if (!sidenav.classList.contains('sidenav-collapsed')) {
            link.innerHTML = `<span class="sidenav-link-icon">${data.icon}</span>`;
        } else {
            link.innerHTML = `<span class="sidenav-link-icon">${data.icon}</span> <span class="sidenav-link-text">${data.label}</span>`;
        }

        if (data.label === 'Logout') {
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
                clearToken(); 
                window.location.href = '#/login';  
            });
        }

        navItem.appendChild(link);
        navItemsContainer.appendChild(navItem);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
    const sidenav = document.getElementById('sidenav');
    const toggleCollapseBtn = document.getElementById('toggleCollapseBtn');
    const closeBtn = document.getElementById('closeBtn');
    const logoText = document.getElementById('logoText');
    app.style.marginLeft = "90px";

    function adjustMargin() {
        const appRect = app.getBoundingClientRect();
        const sidenavWidth = sidenav.classList.contains('sidenav-collapsed') ? 270 : 90;

        if (appRect.left < sidenavWidth + 50) {
            app.style.marginLeft = `${sidenavWidth}px`;
        } else {
            app.style.marginLeft = '90px';
        }
    }

    function toggleCollapse() {
        sidenav.classList.toggle('sidenav-collapsed');
        logoText.style.display = sidenav.classList.contains('sidenav-collapsed') ? 'block' : 'none';
        closeBtn.style.display = sidenav.classList.contains('sidenav-collapsed') ? 'block' : 'none';
        closeBtn.classList.toggle('visible'); 
        adjustMargin();

        loadNavItems();

        if (sidenav.classList.contains('sidenav-collapsed')) {
            logoText.classList.add('fadeInOut');
            closeBtn.classList.add('fadeInOut');
            setTimeout(() => {
                logoText.classList.remove('fadeInOut');
                closeBtn.classList.remove('fadeInOut');
            }, 350);
        }
    }

    toggleCollapseBtn.addEventListener('click', toggleCollapse);
    closeBtn.addEventListener('click', toggleCollapse);

    loadNavItems();
});
