const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_demo',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 3600000 
    }
}));

app.use(express.static(path.join(__dirname, 'src/public')));
const ticketRoutes = require('./src/routes/ticketRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api', authRoutes);     
app.use('/api/tickets', ticketRoutes); 

app.get('/ping', (req, res) => {
    res.status(200).json({ status: "OK", message: "¡Servidor de HelpDesk en línea!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo con éxito en: http://localhost:${PORT}`);
});