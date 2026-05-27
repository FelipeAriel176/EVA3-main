const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/tickets.json');
function leerTickets() {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo la base de datos:", error);
        return [];
    }
}
function guardarTickets(listaTickets) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(listaTickets, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error escribiendo en la base de datos:", error);
    }
}
module.exports = {
    leerTickets,
    guardarTickets
};
