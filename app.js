// app.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'src/public'))); 

const ticketRoutes = require('./src/routes/ticketRoutes');

app.use('/api/tickets', ticketRoutes);
app.get('/ping', (req, res) => {
    res.status(200).json({ status: "OK", message: "¡Servidor de HelpDesk en línea!" });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo con éxito en: http://localhost:${PORT}`);
});