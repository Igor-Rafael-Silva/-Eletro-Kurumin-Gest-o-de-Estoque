const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.route.js');
const componentesRoutes = require('./routes/componentes.route.js');
const movimentacoesRoutes = require('./routes/movimentacoes.route.js');
const relatoriosRoutes = require('./routes/relatorios.route.js');

const app = express();

app.use(cors());
app.use(express.json());

// Definição das Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/componentes', componentesRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/relatorios', relatoriosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚡ Servidor Eletro Kurumin a rodar em http://localhost:${PORT}`);
});