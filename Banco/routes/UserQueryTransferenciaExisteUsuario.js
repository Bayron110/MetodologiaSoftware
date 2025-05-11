import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

// 2.6. Ruta para revisar que el usuario destinatario para la transferencia existe
//Se usa en user.ejs

router.get("/revisarUsuarioDestinatario/:usuario", (request, response) => {
    const usuarioDestinatario = request.params.usuario;

    const consultarExisteUsuarioDestinatario = `
        SELECT * 
        FROM usuariosTable 
        WHERE db_usuario = ? 
        AND db_estado_cuenta = 'Activo'
    `;

    conexion.query(consultarExisteUsuarioDestinatario, [usuarioDestinatario], (error, result) => {
        if (error) {
            return response.json({ mensaje: "Error en el servidor al verificar el usuario." });
        }

        if (result.length > 0) {
            response.json({ mensaje: "El usuario existe y está activo." });
        } else {
            response.json({ mensaje: "El usuario no existe o su cuenta no está activa." });
        }
    });
});

export default router;
