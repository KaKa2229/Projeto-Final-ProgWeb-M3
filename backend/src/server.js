require('dotenv').config();
const express = require('express');
const cors = require('cors');

const importacaoRoutes = require('./routes/importacaoRoutes'); 
const produtoRoutes = require('./routes/produtoRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json()); 

app.use('/api', importacaoRoutes); 
app.use('/api', produtoRoutes);
app.use('/api', estoqueRoutes);
app.use('/api', pedidoRoutes);

app.get('/api', (req, res) => {
    res.send('API da Fake Store está funcionando.');
});

app.listen(PORT, () => {
    console.log(` Servidor Express rodando na porta ${PORT}`);
});