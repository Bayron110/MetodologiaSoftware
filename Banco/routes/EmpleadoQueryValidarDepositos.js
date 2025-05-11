import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

// 1.5.Ruta para aprobar un depósito y actualizar el saldo del usuario
// Se utiliza en empleado.ejs

router.get("/actualizarEstadoDeposito/:idTransaccion", (request, response) => {
    const idTransaccion = request.params.idTransaccion;
    const nuevoEstado = request.query.estado;
    const nombreEntidadAprobatoria = request.query.nombre;
    const usuarioEntidadAprobatoria = request.query.usuario;

    // Paso 1: Obtener el destinatario y el monto del depósito
    const aceptarDepositosModificarSaldo = `
        SELECT db_usuario_cuenta_destinatario, db_saldo_monto_operacion 
        FROM historialFinancieroTable 
        WHERE id_transaccion = ?
    `;

    conexion.query(aceptarDepositosModificarSaldo, [idTransaccion], (errorRevisarCuentaExiste, resultadoCuentaExiste) => {
        if (errorRevisarCuentaExiste || resultadoCuentaExiste.length === 0) {
            console.error("Error al obtener depósito:", errorRevisarCuentaExiste);
            return response.json({ mensaje: "Error al obtener depósito." });
        }

        const { db_usuario_cuenta_destinatario, db_saldo_monto_operacion } = resultadoCuentaExiste[0];

        // Paso 2: Actualizar el estado del depósito
        const actualizarEstadoDeposito = `
        UPDATE historialFinancieroTable 
        SET db_estado_transferencia = ?, 
            db_usuario_entidad_aprobatoria = ?, 
            db_nombre_entidad_aprobatoria = ?, 
            db_fecha_entidad_aprobatoria = NOW()
        WHERE id_transaccion = ?
    `;

        conexion.query(actualizarEstadoDeposito, [nuevoEstado, usuarioEntidadAprobatoria, nombreEntidadAprobatoria, idTransaccion], (err) => {
            if (err) {
                console.error("Error al actualizar estado:", err);
                return response.json({ mensaje: "Error al actualizar estado del depósito." });
            }

            // Si el estado es "Pagado", actualizamos el saldo del destinatario
            if (nuevoEstado === "Pagado") {
                const actualizarSaldoUsuario = `
                    UPDATE usuariosTable 
                    SET db_saldo_total = db_saldo_total + ? 
                    WHERE db_usuario = ?
                `;

                conexion.query(actualizarSaldoUsuario, [db_saldo_monto_operacion, db_usuario_cuenta_destinatario], (err) => {
                    if (err) {
                        console.error("Error al actualizar saldo:", err);
                        return response.json({ mensaje: "Estado actualizado, pero no se pudo actualizar el saldo del usuario." });
                    }
                    response.json({ mensaje: "El deposito ha sido aprobado" });
                });
            } else if (nuevoEstado === "Cancelado") {
                response.json({ mensaje: "La petición ha sido cancelada." });
            } else {
                response.json({ mensaje: "Estado del depósito actualizado correctamente." });
            }
        });
    });
});

export default router;
