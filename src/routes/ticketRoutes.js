const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const requireAuth = require('../middlewares/auth.middleware');

router.get('/', ticketController.obtenerTickets);
router.get('/:id', ticketController.obtenerTicketPorId);
router.post('/', requireAuth, ticketController.crearTicket);
router.put('/:id', requireAuth, ticketController.actualizarTicket);
router.delete('/:id', requireAuth, ticketController.eliminarTicket);

module.exports = router;