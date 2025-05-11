import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

//1.1.Ruta para activar o desactivar cuentas de usuario
//Se utilizar en empleado.ejs

router.get("/actualizarEstadoCuenta/:id", (request, response) => {
    const idCuentaQuery = request.params.id;
    const nuevoEstadoQuery = request.query.estado;
    const cuentaRealizoTransaccionQuery = request.query.usuario;
    const entidadAprobatoriaQuery = request.query.entidadAprobatoria;

    const actualizarEstadoQuery = `
        UPDATE usuariosTable 
        SET db_estado_cuenta = ?
        WHERE id_cuenta = ?
    `;

    conexion.query(actualizarEstadoQuery, [nuevoEstadoQuery, idCuentaQuery], (error, result) => {
        if (error) {
            return response.json({ mensaje: "Error interno al actualizar estado de cuenta." });
        }

        if (nuevoEstadoQuery === "Activo") {
            // Paso 1: Obtener el total actual de fondos en la tabla bancoFondosTable
            const obtenerFondosActualesQuery = `
            SELECT db_dinero_total_banco 
            FROM bancoFondosTable 
            ORDER BY id_monto_banco DESC 
            LIMIT 1
        `;

            conexion.query(obtenerFondosActualesQuery, (err, resultadosObtnerFondosBanco) => {
                if (err) {
                    return response.json({ mensaje: "Error al obtener fondos actuales." });
                }

                // Paso 2: Insertar el historial de fondos en bancoFondosTable
                const nombreBanco = "NeoBank";


                const fondosActuales = resultadosObtnerFondosBanco[0].db_dinero_total_banco;
                const montoInicialCuenta = 10;
                const causaTransaccionAumentoMonto = "Activa Cuenta"

                const insertarHistorialFondosQuery = `
                    INSERT INTO bancoFondosTable (
                        db_nombre_banco,
                        db_cuenta_realizo_transaccion,
                        db_empleado_aprobatorio,
                        db_transaccion_incremento,
                        db_dinero_total_banco
                    ) VALUES (?, ?, ?, ?, ?)
                `;


                const fondosFinalesCuetnaBanco = parseFloat(fondosActuales) + montoInicialCuenta;

                conexion.query(insertarHistorialFondosQuery, [nombreBanco, cuentaRealizoTransaccionQuery, entidadAprobatoriaQuery, causaTransaccionAumentoMonto, fondosFinalesCuetnaBanco], (errorHistorial) => {
                    if (errorHistorial) {
                        return response.json({ mensaje: "Error al registrar en bancoFondosTable." });
                    }

                    return response.json({ mensaje: "La cuenta del usuario ha sido activada y el historial de fondos ha sido registrado." });
                });
            });
        } else {
            return response.json({ mensaje: "Estado actualizado correctamente." });
        }
    });
});

export default router;
