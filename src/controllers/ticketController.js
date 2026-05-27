const db = require('../config/db');
const { calcularPrioridad } = require('../services/ticketService');
function obtenerTickets(req, res) {
    const tickets = db.leerTickets();
    return res.status(200).json(tickets);
}

function crearTicket(req, res) {
    const { nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado } = req.body;

    if (!nombreSolicitante || !correo || !categoria || !descripcion || !impacto || !urgencia || !tiempoEstimado) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const tickets = db.leerTickets();

    const prioridadCalculada = calcularPrioridad(impacto, urgencia, categoria, Number(tiempoEstimado));
    const nuevoTicket = {
        id: Date.now().toString(), 
        nombreSolicitante,
        correo,
        categoria,
        descripcion,
        impacto,
        urgencia,
        tiempoEstimado: Number(tiempoEstimado),
        estado: 'pendiente', 
        prioridad: prioridadCalculada,
        fechaCreacion: new Date().toISOString()
    };

    tickets.push(nuevoTicket);
    db.guardarTickets(tickets);

    return res.status(201).json({
        mensaje: "Ticket creado exitosamente.",
        ticket: nuevoTicket
    });
}

module.exports = {
    obtenerTickets,
    crearTicket
};