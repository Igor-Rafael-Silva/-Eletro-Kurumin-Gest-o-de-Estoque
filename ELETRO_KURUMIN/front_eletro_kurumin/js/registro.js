document.getElementById('form-registro')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (senha !== confirmarSenha) {
        alert('As palavras-passe não coincidem!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Conta criada com sucesso! Por favor, inicie sessão.');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Erro ao efetuar registo.');
        }
    } catch (err) {
        alert('Erro ao ligar ao servidor.');
    }
});