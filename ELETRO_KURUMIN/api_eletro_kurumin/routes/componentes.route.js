const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// Buscar todas as categorias
router.get('/categorias', async (req, res) => {
    try {
        const [categorias] = await db.query('SELECT * FROM categoria ORDER BY nome ASC');
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar todos os componentes
router.get('/', async (req, res) => {
    try {
        const [componentes] = await db.query(`
            SELECT c.*, cat.nome AS categoria_nome, u.nome AS usuario_nome
            FROM componente c
            JOIN categoria cat ON c.id_categoria = cat.id_categoria
            JOIN usuario u ON c.id_usuario = u.id_usuario
            ORDER BY c.nome ASC
        `);
        res.json(componentes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cadastrar novo componente
router.post('/', async (req, res) => {
    const { id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO componente (id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque) VALUES (?, ?, ?, ?, ?, ?)',
            [id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque]
        );
        res.status(201).json({ message: 'Componente criado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar componente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_categoria, nome, descricao, preco, quantidade_estoque } = req.body;
    try {
        await db.query(
            'UPDATE componente SET id_categoria = ?, nome = ?, descricao = ?, preco = ?, quantidade_estoque = ? WHERE id_componente = ?',
            [id_categoria, nome, descricao, preco, quantidade_estoque, id]
        );
        res.json({ message: 'Componente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar componente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM componente WHERE id_componente = ?', [id]);
        res.json({ message: 'Componente eliminado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;