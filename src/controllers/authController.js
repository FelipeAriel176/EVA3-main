exports.login = (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ ok: false, mensaje: "Usuario y contraseña necesarios." });
    }

    if (usuario === "felipe" && contrasena === "123") {
        req.session.usuario = usuario;
        req.session.autenticado = true;

        return res.status(200).json({ 
            ok: true, 
            mensaje: "Inicio de sesión exitoso" 
        });
    } else {
        return res.status(401).json({ 
            ok: false, 
            mensaje: "Credenciales incorrectas." 
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: "No se pudo cerrar la sesión." });
        }
        res.clearCookie('connect.sid'); 
        return res.status(200).json({ ok: true, mensaje: "Sesión cerrada con éxito." });
    });
};

exports.perfil = (req, res) => {
    if (req.session && req.session.autenticado) {
        return res.status(200).json({ ok: true, usuario: req.session.usuario });
    }
    return res.status(401).json({ ok: false, mensaje: "No hay una sesión activa." });
};