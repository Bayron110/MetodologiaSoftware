import { Router } from "express";
import conexion from '../config/conexion.js';

const router = Router();

// 2.2. Ruta para hacer depósito a la misma cuenta
// Se utiliza en user.ejs

router.post("/DepositoCuentaPropia", (request, response) => {
    const usuarioCuentaOriginalQuery = request.body.usuarioCuentaOriginal;
    const nombreUsuarioOriginalQuery = request.body.nombreUsuarioOriginal;

    const saldoActualCuentaOriginalDeposito = parseFloat(request.body.saldoActualCuentaOriginalDeposito);
    const montoOperacionQuery = parseFloat(request.body.saldoModificado);

    const usuarioCuentaDestinatarioQuery = usuarioCuentaOriginalQuery;
    const nombreUsuarioDestinatarioQuery = nombreUsuarioOriginalQuery;

    const tipoOperacionQuery = "Deposito";
    const estadoTransferenciaQuery = "Pendiente";
    const porcentajeBanco = 0.00;

    const montoCuentaPosiblementeTendra = saldoActualCuentaOriginalDeposito + montoOperacionQuery;

    const insertarDepositoUsuario = `
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

    conexion.query(insertarDepositoUsuario, [
        usuarioCuentaOriginalQuery,
        nombreUsuarioOriginalQuery,
        usuarioCuentaDestinatarioQuery,
        nombreUsuarioDestinatarioQuery,
        tipoOperacionQuery,
        estadoTransferenciaQuery,
        saldoActualCuentaOriginalDeposito,
        montoOperacionQuery,
        porcentajeBanco,
        montoCuentaPosiblementeTendra,
    ], (error, result) => {
        if (error) {
            console.error("Error al registrar depósito:", error);
            return response.redirect("/error/errorOperacionUsuario.html");
        }

        return response.redirect("/correct/userTareaExitoso.html");
    });
});


export default router;
