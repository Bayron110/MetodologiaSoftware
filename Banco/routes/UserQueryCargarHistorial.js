import { Router } from "express";
import conexion from '../config/conexion.js';

const router = Router();

//2.1 Ruta para obtener historial de transacciones y depositos de un usuario
//Se utiliza en user.ejs

router.get("/historialTransaccionRecargaUsuario/:idUsuario", (request, response) => {
    const idUsuario = request.params.idUsuario;

    // Mostrar todas las transacciones en las que el usuario fue ORIGEN o DESTINATARIO
    const recuperarHistorialUsuario = `
        SELECT * 
        FROM historialFinancieroTable 
        WHERE db_usuario_cuenta_original = ? OR db_usuario_cuenta_destinatario = ?
        ORDER BY db_fecha_transaccion DESC
    `;

    conexion.query(recuperarHistorialUsuario, [idUsuario, idUsuario], (error, result) => {
        if (error) {
            return response.json({ error: "Error interno del servidor." });
        }

        if (result.length === 0) {
            return response.json({ mensaje: "No tiene transacciones realizadas." });
        }
        return response.json(result);
    });
});


export default router;
