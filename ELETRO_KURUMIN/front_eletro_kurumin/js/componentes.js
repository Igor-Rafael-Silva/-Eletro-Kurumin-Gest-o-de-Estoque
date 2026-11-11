document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('user-name').textContent = usuario.nome;
    
    carregarCategorias();
    carregarRelatorio();

    document.getElementById('form-componente').addEventListener('submit', adicionarComponente);
});

// Buscar e preencher categorias no select
async function carregarCategorias() {
    try {
        const res = await fetch('http://localhost:3000/api/componentes/categorias');
        const categorias = await res.json();

        const select = document.getElementById('comp-categoria');
        select.innerHTML = '<option value="">Selecione a Categoria</option>';

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.nome;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar categorias:', err);
    }
}

// Carregar Lista de Componentes e KPIs
async function carregarRelatorio() {
    try {
        const res = await fetch('http://localhost:3000/api/relatorios/estoque');
        const data = await res.json();

        document.getElementById('kpi-valor-total').textContent = `R$ ${parseFloat(data.resumo.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('kpi-total-unidades').textContent = data.resumo.total_unidades;
        document.getElementById('kpi-total-itens').textContent = data.resumo.total_itens;

        const tbody = document.getElementById('tabela-componentes');
        tbody.innerHTML = '';

        data.detalhes.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id_componente}</td>
                <td>${item.nome}</td>
                <td>${item.categoria}</td>
                <td><strong>${item.quantidade_estoque}</strong></td>
                <td>R$ ${parseFloat(item.preco).toFixed(2)}</td>
                <td>R$ ${parseFloat(item.valor_subtotal).toFixed(2)}</td>
                <td>
                    <button class="btn-add-unit" onclick="adicionarUmaUnidade(${item.id_componente})">+1 Unidade</button>
                    <button class="btn-sub" onclick="retirarUmaUnidade(${item.id_componente}, ${item.quantidade_estoque})">-1 Unidade</button>
                    <button class="btn-delete" onclick="removerComponente(${item.id_componente})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar relatório:', err);
    }
}

// Função para adicionar 1 unidade ao estoque existente
async function adicionarUmaUnidade(idComponente) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const movimentacao = {
        id_componente: idComponente,
        id_usuario: usuario.id,
        tipo: 'entrada',
        quantidade: 1,
        justificativa: 'Adição de 1 unidade via painel'
    };

    try {
        const res = await fetch('http://localhost:3000/api/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movimentacao)
        });

        if (res.ok) {
            carregarRelatorio(); // Recarrega a tabela e KPIs na hora
        } else {
            const errData = await res.json();
            alert(errData.error || 'Erro ao adicionar unidade ao estoque.');
        }
    } catch (err) {
        alert('Erro de conexão ao comunicar com o servidor.');
    }
}

// Função para dar baixa em 1 unidade no estoque
async function retirarUmaUnidade(idComponente, quantidadeAtual) {
    if (quantidadeAtual <= 0) {
        alert('Este componente já está com o estoque zerado!');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const movimentacao = {
        id_componente: idComponente,
        id_usuario: usuario.id,
        tipo: 'saida',
        quantidade: 1,
        justificativa: 'Baixa de 1 unidade via painel'
    };

    try {
        const res = await fetch('http://localhost:3000/api/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movimentacao)
        });

        if (res.ok) {
            carregarRelatorio();
        } else {
            const errData = await res.json();
            alert(errData.error || 'Erro ao dar baixa no estoque.');
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor.');
    }
}

// Cadastrar Novo Componente
async function adicionarComponente(e) {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const novoItem = {
        nome: document.getElementById('comp-nome').value,
        id_categoria: parseInt(document.getElementById('comp-categoria').value),
        id_usuario: usuario.id,
        preco: parseFloat(document.getElementById('comp-preco').value),
        quantidade_estoque: parseInt(document.getElementById('comp-qtd').value),
        descricao: document.getElementById('comp-desc').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/componentes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoItem)
        });

        if (res.ok) {
            alert('Componente adicionado com sucesso!');
            document.getElementById('form-componente').reset();
            carregarRelatorio();
        } else {
            const errData = await res.json();
            alert(errData.error || 'Erro ao adicionar componente.');
        }
    } catch (err) {
        alert('Erro de conexão ao adicionar componente.');
    }
}

// Eliminar componente completo
async function removerComponente(id) {
    if (!confirm(`Tem a certeza que deseja eliminar o componente ID ${id}?`)) return;

    try {
        const res = await fetch(`http://localhost:3000/api/componentes/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Componente removido do estoque!');
            carregarRelatorio();
        } else {
            const errData = await res.json();
            alert(errData.error || 'Erro ao remover componente.');
        }
    } catch (err) {
        alert('Erro de conexão ao remover componente.');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}