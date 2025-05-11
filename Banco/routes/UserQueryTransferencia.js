import { Router } from "express";
import conexion from '../config/conexion.js';

const router = Router();

//2.5 Query para realziar la transfrencia de una cuenta a otra
//Se utiliza en user.ejs

router.post("/transferenciaOtraCuenta", (request, response) => {
    const usuarioCuentaOriginal = request.body.usuarioCuentaOriginalTransferencia;
    const usuarioCuentaDestinatario = request.body.usuarioCuentaDestinatarioTransferencia;
    const montoAntesCuentaTenia = request.body.saldoActualTransferencia;
    const montoTransferencia = parseFloat(request.body.saldoModificadoTransferencia);
    const nombreCuentaOriginal = request.body.nombreCuentaOriginalTransferencia;
    const porcentajeBanco = parseFloat(request.body.porcentajeBanco);
    const montoAhoraCuentaTiene = request.body.saldoRestanteTransferencia;

    const tipoOperacion = "Transferencia";
    const estadoOperacion = "Pagado";


    // 1. Verificar que el destinatario existe
    const verificarDestinatarioQuery = `
        SELECT db_nombre_completo FROM usuariosTable WHERE db_usuario = ?
    `;
    conexion.query(verificarDestinatarioQuery, [usuarioCuentaDestinatario], (error, results) => {
        if (error) return response.status(500).json({ error: "Error al verificar cuenta destinataria." });
        if (results.length === 0) return response.status(404).json({ error: "La cuenta destinataria no existe." });

        const nombreDestinatario = results[0].db_nombre_completo;

        // 2. Obtener saldo de la cuenta origen
        const obtenerSaldoOrigenQuery = `
            SELECT db_saldo_total FROM usuariosTable WHERE db_usuario = ?
        `;
        conexion.query(obtenerSaldoOrigenQuery, [usuarioCuentaOriginal], (error, resultsOrigen) => {
            if (error) return response.status(500).json({ error: "Error al obtener saldo de cuenta origen." });

            const saldoActualOrigen = parseFloat(resultsOrigen[0].db_saldo_total);
            const nuevoSaldoOrigen = saldoActualOrigen - (montoTransferencia + porcentajeBanco);

            if (nuevoSaldoOrigen < 0) {
                return response.status(400).json({ error: "Saldo insuficiente para realizar la transferencia." });
            }

            // 3. Actualizar saldo del origen
            const actualizarSaldoOrigenQuery = `
                UPDATE usuariosTable SET db_saldo_total = ? WHERE db_usuario = ?
            `;
            conexion.query(actualizarSaldoOrigenQuery, [nuevoSaldoOrigen, usuarioCuentaOriginal], (error) => {
                if (error) return response.status(500).json({ error: "Error al debitar saldo de cuenta origen." });

                // 4. Acreditar saldo al destinatario
                const acreditarSaldoDestinatarioQuery = `
                    UPDATE usuariosTable SET db_saldo_total = db_saldo_total + ? WHERE db_usuario = ?
                `;
                conexion.query(acreditarSaldoDestinatarioQuery, [montoTransferencia, usuarioCuentaDestinatario], (error) => {
                    if (error) return response.status(500).json({ error: "Error al acreditar saldo al destinatario." });

                    // 5. Insertar en historial
                    const insertarHistorialQuery = `
                        INSERT INTO historialFinancieroTable (
                            db_usuario_cuenta_original,
                            db_nombre_usuario_original,
                            db_usuario_cuenta_destinatario,
                            db_nombre_usuario_destinatario,
                            db_tipo_operacion,
                            db_estado_transferencia,
                            db_saldo_cuenta_original_tenia,
                            db_saldo_monto_operacion,
                            db_porcentaje_banco,
                            db_saldo_cuenta_original_tiene
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    conexion.query(insertarHistorialQuery, [
                        usuarioCuentaOriginal,
                        nombreCuentaOriginal,
                        usuarioCuentaDestinatario,
                        nombreDestinatario,
                        tipoOperacion,
                        estadoOperacion,
                        montoAntesCuentaTenia,
                        montoTransferencia,
                        porcentajeBanco,
                        montoAhoraCuentaTiene,
                    ], (error) => {
                        if (error) return response.status(500).json({ error: "Error al registrar en historial financiero." });

                        // 6. Actualizar fondo del banco (por comisión)
                        const obtenerFondoActualQuery = `
                            SELECT db_dinero_total_banco FROM bancoFondosTable ORDER BY id_monto_banco DESC LIMIT 1
                        `;
                        conexion.query(obtenerFondoActualQuery, (error, results) => {
                            if (error) return response.status(500).json({ error: "Error al consultar fondo del banco." });

                            const fondoAnterior = results.length > 0 ? parseFloat(results[0].db_dinero_total_banco) : 0.00;
                            const nuevoFondo = fondoAnterior + porcentajeBanco;

                            const insertarNuevoFondoQuery = `
                                INSERT INTO bancoFondosTable (
                                    db_nombre_banco,
                                    db_cuenta_realizo_transaccion,
                                    db_transaccion_incremento,
                                    db_dinero_total_banco
                                ) VALUES (?, ?, ?, ?)
                            `;
                            conexion.query(insertarNuevoFondoQuery, [
                                "NeoBank",
                                usuarioCuentaOriginal,
                                "Transferencia",
                                nuevoFondo
                            ], (error) => {
                                if (error) return response.status(500).json({ error: "Error al actualizar fondo del banco." });

                                return response.redirect("/correct/userTareaExitoso.html");
                            });
                        });
                    });
                });
            });
        });
    });
});

export default router;
