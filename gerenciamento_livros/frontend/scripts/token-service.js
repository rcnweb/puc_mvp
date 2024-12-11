function getUserRole() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role; 
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}

function getUserId() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; 
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}

function clearToken() {
    sessionStorage.removeItem('token');
}

function getToken() {
    const token = sessionStorage.getItem('token');
    return token;
}