import { Router } from "express";
import conexion from '../config/conexion.js';

const router = Router();

//2.4 Ruta para Registrar el usuario en la base de datos
//Se utiliza en registerUsuario.html

router.post("/registroUsuario", (request, response) => {
    const nombreCompletoQuery = request.body.nombreCompleto;
    const cedulaQuery = request.body.cedula;
    const correoElectronicoQuery = request.body.correoElectronico;
    const telefonoQuery = request.body.telefono;
    const direccionQuery = request.body.direccion;
    const tipoCuentaQuery = request.body.tipoCuenta;
    const usuarioQuery = request.body.usuario;
    const contrasenaQuery = request.body.contrasena;

    const saldoTotalQuery = 0;
    const estadoCuentaQuery = "Pendiente";

    const insertarUsuarioBaseDatos = `
        INSERT INTO usuariosTable (
            db_nombre_completo,
            db_cedula,
            db_correo_electronico,
            db_telefono,
            db_direccion,
            db_tipo_cuenta,
            db_usuario,
            db_contrasena,
            db_saldo_total,
            db_estado_cuenta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(insertarUsuarioBaseDatos, [
        nombreCompletoQuery,
        cedulaQuery,
        correoElectronicoQuery,
        telefonoQuery,
        direccionQuery,
        tipoCuentaQuery,
        usuarioQuery,
        contrasenaQuery,
        saldoTotalQuery,
        estadoCuentaQuery,
    ], (error, result) => {
        
        if (error) {
            console.error("Error al registrar usuario:", error);

            // Si el error es por valor duplicado
            if (error.code === 'ER_DUP_ENTRY') {
                return response.redirect("/error/errorRegistro.html");
            }

            return response.redirect("/error/errorRegistro.html");
        }
        
        response.redirect("/correct/registroExitoso.html");
    });
});

export default router;
