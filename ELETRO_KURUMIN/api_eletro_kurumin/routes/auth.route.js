const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de Utilizador
router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const [existente] = await db.query('SELECT id_usuario FROM usuario WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(400).json({ message: 'E-mail já se encontra registado.' });
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        await db.query(
            'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashSenha]
        );

        res.status(201).json({ message: 'Utilizador registado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor: ' + err.message });
    }
});

// Login de Utilizador
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const usuario = users[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const secretKey = process.env.JWT_SECRET || 'kurumin_chave_secreta';
        const token = jwt.sign(
            { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email },
            secretKey,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login efetuado com sucesso!',
            token,
            usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email }
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor: ' + err.message });
    }
});

module.exports = router;
        