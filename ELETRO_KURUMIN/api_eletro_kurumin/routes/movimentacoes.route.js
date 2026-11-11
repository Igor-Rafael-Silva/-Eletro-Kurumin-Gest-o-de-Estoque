const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Listar histórico de movimentações
router.get('/', async (req, res) => {
    try {
        const [movs] = await db.query(`
            SELECT m.*, c.nome AS componente_nome, u.nome AS usuario_nome
            FROM movimentacao m
            JOIN componente c ON m.id_componente = c.id_componente
            JOIN usuario u ON m.id_usuario = u.id_usuario
            ORDER BY m.data_movimentacao DESC
        `);
        res.json(movs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrar nova movimentação (Entrada / Saída)
router.post('/', async (req, res) => {
    const { id_componente, id_usuario, tipo, quantidade, justificativa } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insere a movimentação
        await connection.query(
            'INSERT INTO movimentacao (id_componente, id_usuario, tipo, quantidade, justificativa) VALUES (?, ?, ?, ?, ?)',
            [id_componente, id_usuario, tipo, quantidade, justificativa]
        );

        // Atualiza o estoque do componente
        const operador = tipo === 'entrada' ? '+' : '-';
        await connection.query(
            `UPDATE componente SET quantidade_estoque = quantidade_estoque ${operador} ? WHERE id_componente = ?`,
            [quantidade, id_componente]
        );

        await connection.commit();
        res.status(201).json({ message: 'Movimentação registrada e estoque atualizado com sucesso!' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;