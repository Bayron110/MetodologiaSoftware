import { Router } from "express";
import conexion from "../config/conexion.js";

const router = Router();

// 1.4.Ruta para logear al empleado
//Se utilizar en empleadoLogin.html

router.post("/loginEmpleado", (request, response) => {
    const correoElectronicoQuery = request.body.correoElectronico;
    const contrasenaQuery = request.body.contrasena;

    const revisarCredencialesEmpleadoBaseDatos = `
        SELECT * 
        FROM empleadoBancoTable 
        WHERE db_correo_electronico_empleado = ? OR db_usuario_empleado = ?
    `;

    conexion.query(revisarCredencialesEmpleadoBaseDatos, [correoElectronicoQuery,correoElectronicoQuery], (errorExisteEmpleado, resultadosExisteEmpleado) => {
        if (errorExisteEmpleado) {
            return response.redirect("/error/errorLogin.html");
        }

        if (resultadosExisteEmpleado.length === 1) {
            const empleadoDatos = resultadosExisteEmpleado[0]; 

            // Verificar si coincide la contraseña y si el empleado está activo         
            if (contrasenaQuery === empleadoDatos.db_contrasena_empleado) {
                
                //Aqui se valida el estado y rol y se pasa la respuesta del conexion a la funcion
                //para cargar los datos en empleado.ejs
                if (empleadoDatos.db_estado_empleado === "Activo" && 
                    empleadoDatos.db_rol_empleado === "Empleado") {
                    iniciarSesionEmpleado(empleadoDatos, request, response);

                } else {
                    return response.redirect("/error/errorLoginCajero.html");
                }
            } else {
                return response.redirect("/error/errorLoginCajero.html");
            }
        } else {
            return response.redirect("/error/errorLoginCajero.html");
        }
    });
});

// Función para iniciar sesión como cajero
function iniciarSesionEmpleado(empleadoIngreso, requestCrearSesionEmpleado, responseInicioSesionEmpleado) {
    requestCrearSesionEmpleado.session.login = true;
    requestCrearSesionEmpleado.session.idEmpleadoLogin = empleadoIngreso.id_empleado;
    requestCrearSesionEmpleado.session.nombreEmpleadoLogin = empleadoIngreso.db_nombre_apellido_empleado;
    requestCrearSesionEmpleado.session.cedulaEmpleadoLogin = empleadoIngreso.db_cedula_empleado;
    requestCrearSesionEmpleado.session.correoEmpleadoLogin = empleadoIngreso.db_correo_electronico_empleado;
    requestCrearSesionEmpleado.session.usuarioEmpleadoLogin = empleadoIngreso.db_usuario_empleado;
    requestCrearSesionEmpleado.session.direccionEmpleadoLogin = empleadoIngreso.db_direccion_empleado;
    requestCrearSesionEmpleado.session.estadoEmpleadoLogin = empleadoIngreso.db_estado_empleado;
    requestCrearSesionEmpleado.session.rolEmpleadoLogin = empleadoIngreso.db_rol_empleado;

    console.log("Sesión de cajero creada:", requestCrearSesionEmpleado.session);

    responseInicioSesionEmpleado.render("empleado", { datosCajero: requestCrearSesionEmpleado.session });
}

export default router;
