import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// Importar rutas

//Rutas del perfil del usuario
//Rutas de registopr y login del usuario
import UserQueryRegistrApp from "./routes/UserQueryRegistro.js";
import UserQueryLoginApp from "./routes/UserQueryLogin.js";
//Rutas relacionadas a las transferencias,cargar hisotiral,depositos.
import UserQueryDepositoApp from "./routes/UserQueryDeposito.js";
import UserQueryTransferenciaApp from "./routes/UserQueryTransferencia.js";
import UserQueryTransferenciaExisteUsuario from "./routes/UserQueryTransferenciaExisteUsuario.js"
import UserQueryCargarHistorialApp from "./routes/UserQueryCargarHistorial.js"

//Rutas de las funciones del cajero
import EmpleadoQueryLoginApp from "./routes/EmpleadoQueryLogin.js"
//Activar cuentas
import EmpleadoQueryEstadoCuentasApp from "./routes/EmpleadoQueryCargarEstadoCuentaUsuarios.js"
import EmpleadoQueryActualizarEstadoCuentasApp from "./routes/EmpleadoQueryActualizarEstadoCuentaUsuario.js"
//Valirdar depositos
import EmpleadoQueryCargarDepositosApp from "./routes/EmpleadoQueryCargarDepositosHistorial.js"
import EmpleadoQueryValidarDepositosApp from "./routes/EmpleadoQueryValidarDepositos.js";


const app = express();

//Util para cargar archivos desde el mismo directorio, usar express.static
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Configurar vistas y motor de plantillas
app.set("views", path.join(dirname, "pages"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Manejo de sesiones
app.use(session({
    secret: 'contrasena',
    resave: false,
    saveUninitialized: false
}));

// Archivos estáticos
app.use(express.static(path.join(dirname, "pages")));

// Rutas de lógica

//Rutas del usuario
//Rutas de login y registro
app.use("/", UserQueryRegistrApp);
app.use("/", UserQueryLoginApp);
//Rutas de funcioneas
app.use("/", UserQueryDepositoApp);
app.use("/", UserQueryTransferenciaApp);
app.use("/", UserQueryCargarHistorialApp);
app.use("/", UserQueryTransferenciaExisteUsuario);

//Rutas del cajero
app.use("/", EmpleadoQueryValidarDepositosApp);
app.use("/", EmpleadoQueryEstadoCuentasApp);
app.use("/", EmpleadoQueryActualizarEstadoCuentasApp);
app.use("/", EmpleadoQueryCargarDepositosApp);
app.use("/", EmpleadoQueryLoginApp);


// Puerto y comando para iniciar el programa en Terminal: node app.js
const PORT = 3008;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
