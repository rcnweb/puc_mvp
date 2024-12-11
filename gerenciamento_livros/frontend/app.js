function exibirMensagem(mensagem, tipo) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${tipo}`;
    mensagemDiv.textContent = mensagem;
    document.body.appendChild(mensagemDiv);

    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
}