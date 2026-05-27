module.exports = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        return next();
    }

    return res.status(401).json({ 
        ok: false, 
        mensaje: "Anicie sesión para realizar esta acción." 
    });
};