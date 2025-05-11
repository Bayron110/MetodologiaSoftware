import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

// 1.3.Ruta para obtener todos los usuarios
// Se utiliza en empleado.ejs

router.get("/todosLosUsuarios", (request, response) => {

    const recuperarTodosUsuariosRegistrados = 
    "SELECT * FROM usuariosTable ORDER BY db_fecha_creacion_usuario DESC";
    
    conexion.query(recuperarTodosUsuariosRegistrados, (error, result) => {
        if (error) {
            return response.json({ error: "Error al obtener los usuarios." });
        }
        response.json(result);
    });
});


export default router;
