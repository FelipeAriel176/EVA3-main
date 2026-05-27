const db = require('../config/db');
const { calcularPrioridad } = require('../services/ticketService');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.obtenerTickets = (req, res) => {
    try {
        const tickets = db.leerTickets();
        return res.status(200).json({ ok: true, data: tickets });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: "Error al leer los tickets." });
    }
};

exports.obtenerTicketPorId = (req, res) => {
    const { id } = req.params;
    const tickets = db.leerTickets();
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
        return res.status(404).json({ ok: false, mensaje: "Ticket no encontrado" });
    }
    return res.status(200).json({ ok: true, data: ticket });
};

exports.crearTicket = (req, res) => {
    const { nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado } = req.body;

    if (!nombreSolicitante || !correo || !categoria || !descripcion || !impacto || !urgencia || tiempoEstimado === undefined) {
        return res.status(400).json({ ok: false, mensaje: "Todos los campos son obligatorios." });
    }

    if (!EMAIL_REGEX.test(correo)) {
        return res.status(400).json({ ok: false, mensaje: "El formato del correo es inválido." });
    }

    const impactosValidos = ['bajo', 'medio', 'alto'];
    const urgenciasValidas = ['baja', 'media', 'alta'];

    if (!impactosValidos.includes(impacto.toLowerCase()) || !urgenciasValidas.includes(urgencia.toLowerCase())) {
        return res.status(400).json({ ok: false, mensaje: "Valores de impacto o urgencia no permitidos." });
    }

    try {
        const tickets = db.leerTickets();
        
        const prioridadCalculada = calcularPrioridad(impacto.toLowerCase(), urgencia.toLowerCase(), categoria.toLowerCase(), Number(tiempoEstimado));
        
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
            ok: true,
            mensaje: "Ticket creado exitosamente.",
            data: nuevoTicket
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: "Error al guardar el ticket en el sistema." });
    }
};

exports.actualizarTicket = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ ok: false, mensaje: "El campo estado es requerido." });
    }

    const estadosValidos = ['pendiente', 'en proceso', 'resuelto'];
    if (!estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).json({ ok: false, mensaje: "Estado inválido." });
    }

    const tickets = db.leerTickets();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ ok: false, mensaje: "ID inexistente." });
    }

    tickets[index].estado = estado.toLowerCase();
    db.guardarTickets(tickets);

    return res.status(200).json({
        ok: true,
        mensaje: "Estado del ticket actualizado con éxito.",
        data: tickets[index]
    });
};

exports.eliminarTicket = (req, res) => {
    const { id } = req.params;
    const tickets = db.leerTickets();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ ok: false, mensaje: "ID inexistente." });
    }

    tickets.splice(index, 1); 
    db.guardarTickets(tickets);

    return res.status(200).json({
        ok: true,
        mensaje: "Ticket eliminado de la persistencia de forma exitosa."
    });
};