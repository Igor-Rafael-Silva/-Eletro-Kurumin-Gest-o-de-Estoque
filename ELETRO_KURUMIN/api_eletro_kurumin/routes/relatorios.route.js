const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Relatório completo de estoque com valor total
router.get('/estoque', async (req, res) => {
    try {
        const [detalhes] = await db.query(`
            SELECT 
                c.id_componente,
                c.nome,
                cat.nome AS categoria,
                c.quantidade_estoque,
                c.preco,
                (c.quantidade_estoque * c.preco) AS valor_subtotal
            FROM componente c
            JOIN categoria cat ON c.id_categoria = cat.id_categoria
            ORDER BY c.nome ASC
        `);

        const [[resumo]] = await db.query(`
            SELECT 
                COUNT(*) AS total_itens_diferentes,
                IFNULL(SUM(quantidade_estoque), 0) AS total_unidades,
                IFNULL(SUM(quantidade_estoque * preco), 0) AS valor_total_estoque
            FROM componente
        `);

        res.json({
            resumo: {
                total_itens: resumo.total_itens_diferentes,
                total_unidades: resumo.total_unidades,
                valor_total: parseFloat(resumo.valor_total_estoque).toFixed(2)
            },
            detalhes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;