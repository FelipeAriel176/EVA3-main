/**
 * @param {string} impacto  
 * @param {string} urgencia 
 * @param {string} categoria 
 * @param {number} tiempoEstimado 
 * @returns {string} - 
 */
function calcularPrioridad(impacto, urgencia, categoria, tiempoEstimado) {
    let puntajeTotal = 0;

    if (impacto === 'bajo') puntajeTotal += 1;
    else if (impacto === 'medio') puntajeTotal += 2;
    else if (impacto === 'alto') puntajeTotal += 3;

    if (urgencia === 'baja') puntajeTotal += 1;
    else if (urgencia === 'media') puntajeTotal += 2;
    else if (urgencia === 'alta') puntajeTotal += 3;

    if (categoria === 'red' || categoria === 'cuenta') {
        puntajeTotal += 1;
    }

    if (tiempoEstimado > 4) {
        puntajeTotal += 1;
    }

    if (puntajeTotal >= 1 && puntajeTotal <= 3) return 'Baja';
    if (puntajeTotal >= 4 && puntajeTotal <= 5) return 'Media';
    if (puntajeTotal === 6) return 'Alta';
    if (puntajeTotal >= 7) return 'Crítica';

    return 'Baja';
}

module.exports = {
    calcularPrioridad
};
