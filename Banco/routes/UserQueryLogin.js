import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

// 2.3.Ruta para logear un usuario 
//Se utiliza en loginUsuario.html

router.post("/loginUser", (request, response) => {
    const correoElectronicoQuery = request.body.correoElectronico;
    const contrasenaQuery = request.body.contrasena;

    const revisarCredencialesUsuarioBaseDatos = `
        SELECT * 
        FROM usuariosTable 
        WHERE db_correo_electronico = ? 
        OR db_usuario = ?
    `;

    // Verificar si los datos ingresados en el form de login existe en la base de datos
    conexion.query(revisarCredencialesUsuarioBaseDatos, [correoElectronicoQuery, correoElectronicoQuery], (errorExiste, resultExisteCredencialesUsuario) => {
        
        if (errorExiste) {
            console.error("Error en consulta de usuarios:", errorExiste);
            return response.redirect("/error/errorLogin.html");
        }

        if (resultExisteCredencialesUsuario.length === 1) {
            const usuarioDatos = resultExisteCredencialesUsuario[0];

            // Verificar si la contraseña coincide y luego que el perfil este activo y posteriormente
            //pasar los datos a la funcion y redirigir al user.ejs
            if (contrasenaQuery === usuarioDatos.db_contrasena) {

                if (usuarioDatos.db_estado_cuenta === "Activo") {
                    iniciarSesionUsuario(usuarioDatos, request, response);

                } else {
                    return response.redirect("/error/errorLogin.html");
                }
            } else {
                return response.redirect("/error/errorLogin.html");
            }
        } else {
            return response.redirect("/error/errorLogin.html");
        }
    });
});

// Función para iniciar sesión como usuario -- cliente
function iniciarSesionUsuario(usuarioIngreso, requestCrearSesionUsuario, responseInicioSesionUsuario) {
    requestCrearSesionUsuario.session.login = true;
    requestCrearSesionUsuario.session.idCuentaLogin = usuarioIngreso.id_cuenta;
    requestCrearSesionUsuario.session.nombreCompletoLogin = usuarioIngreso.db_nombre_completo;
    requestCrearSesionUsuario.session.cedulaLogin = usuarioIngreso.db_cedula;
    requestCrearSesionUsuario.session.correoElectronicoLogin = usuarioIngreso.db_correo_electronico;
    requestCrearSesionUsuario.session.telefonoLogin = usuarioIngreso.db_telefono;
    requestCrearSesionUsuario.session.direccionLogin = usuarioIngreso.db_direccion;
    requestCrearSesionUsuario.session.tipoCuentaLogin = usuarioIngreso.db_tipo_cuenta;
    requestCrearSesionUsuario.session.usuarioLogin = usuarioIngreso.db_usuario;
    requestCrearSesionUsuario.session.contrasenaLogin = usuarioIngreso.db_contrasena;
    requestCrearSesionUsuario.session.saldoTotalLogin = usuarioIngreso.db_saldo_total;

    console.log("Sesión de usuario creada:", requestCrearSesionUsuario.session);

    responseInicioSesionUsuario.render("user", { datos: requestCrearSesionUsuario.session });
}

export default router;
