import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

//1.2. Ruta para traer solo los depositos de la base de datos de los usuarios
//Se utiliza en empleado.ejs

router.get("/listarDepositos", (request, response) => {
    const recuperarDepositosUsuarios = `
        SELECT *
            FROM historialFinancieroTable
            WHERE db_tipo_operacion = 'Deposito'
            ORDER BY db_fecha_transaccion DESC
    `;

    conexion.query(recuperarDepositosUsuarios, (error, results) => {
        if (error) {
            console.error("Error al obtener los depósitos:", error);
            return response.status(500).json({ error: "Error al obtener los depósitos." });
        }
        response.json(results);
    });
});


export default router;