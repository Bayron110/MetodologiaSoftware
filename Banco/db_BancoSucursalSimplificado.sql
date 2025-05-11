create database db_banco;

use db_banco;

/********************TABLA DE DATOS DE USUARIOS**********************/
create table usuariosTable (
	id_cuenta int auto_increment not null ,
    db_nombre_completo varchar(100) not null,
	db_cedula varchar(10) not null unique,
    db_correo_electronico varchar(100) not null unique,
    db_telefono varchar(10) not null unique,
    db_direccion varchar(100) not null,
	db_tipo_cuenta enum("Cuenta Digital","Cuenta Corriente","Cuenta Ideal","Cuenta Ahorros") not null,
    db_usuario varchar(100) not null unique,
    db_contrasena varchar (100) not null,
    db_saldo_total decimal(10,2) not null,
	db_estado_cuenta enum("Activo","Pendiente","Desactivado") not null,
    db_fecha_creacion_usuario timestamp default current_timestamp,
    
	db_empleado_usuario_cambios varchar(100),
    db_empleado_nombre_cambios varchar(100),
    db_fecha_usuario_cambios datetime,
    
    
    constraint primary key (id_cuenta)
);

/*****************Query para modificar los datos de un usuario por parte de un empleado*/
/*
UPDATE usuariosTable
SET
    db_correo_electronico = 'nuevo_correo@example.com',
    db_telefono = '0999999999',
    db_direccion = 'Nueva dirección 456',
    db_tipo_cuenta = 'Cuenta Corriente',
    db_contrasena = 'nueva_contrasena123',
    db_estado_cuenta = 'Activo',

    db_empleado_usuario_cambios = '2',
    db_empleado_nombre_cambios = 'Juan Perez',
    db_fecha_usuario_cambios = NOW()
WHERE db_usuario = 'usuario_cliente';
*/

/*Query para ver todos los datos de los usuarios*/
Select * from usuariosTable;


/********************TABLA HISTORIAL DE TRANSACCIONES DE USUARIOS**********************/
create table historialFinancieroTable (
	id_transaccion int auto_increment not null,
    
    db_usuario_cuenta_original varchar(100) not null,
    db_nombre_usuario_original varchar(100) not null,
    
    db_usuario_cuenta_destinatario varchar(100) not null,
	db_nombre_usuario_destinatario varchar(100) not null,
    
    db_tipo_operacion enum("Transferencia","Deposito") not null,
    db_estado_transferencia enum("Pagado","Pendiente","Cancelado") not null,

	db_saldo_cuenta_original_tenia decimal(10,2) not null,
    db_saldo_monto_operacion decimal(10,2) not null,
    db_porcentaje_banco decimal(10,2),
    db_saldo_cuenta_original_tiene decimal(10,2),
	db_fecha_transaccion timestamp default current_timestamp,
    
    db_usuario_entidad_aprobatoria varchar(100) null,
    db_nombre_entidad_aprobatoria varchar(100) null,
    db_fecha_entidad_aprobatoria datetime null,

    constraint primary key (id_transaccion)
);

Select * from historialFinancieroTable;


/********************TABLA DE DATOS DE EMPLEADOS**********************/
create table empleadoBancoTable (
    id_empleado int auto_increment,
    db_nombre_apellido_empleado varchar(100) not null,
    db_cedula_empleado varchar(10) not null unique,
    db_correo_electronico_empleado varchar(100) not null unique,
    db_usuario_empleado varchar(100) not null unique,
    db_contrasena_empleado varchar(100) not null,
    db_telefono_empleado varchar(10) not null,
    db_direccion_empleado varchar(100) not null,
    db_rol_empleado enum("Administrador","Empleado") not null,
    db_estado_empleado enum('Activo', 'Suspendido', 'Eliminado') not null,
	db_fecha_ingreso_empleado timestamp default current_timestamp,
    
    
    db_administrador_usuario_cambios varchar(100),
    db_administrador_nombre_cambios varchar(100),
    db_fecha_empleado_cambios datetime,
    
    
    primary key (id_empleado)
);

/*Query para añadir administrador*/
insert into empleadoBancoTable (
    db_nombre_apellido_empleado,
    db_cedula_empleado,
    db_correo_electronico_empleado,
    db_usuario_empleado,
    db_contrasena_empleado,
    db_telefono_empleado,
    db_direccion_empleado,
	db_rol_empleado,
    db_estado_empleado
) values (
    'Maria loiza',
    '099999999',
    'mar@gmail.com',
    '1',
    '1',
    '0999999999',
    'Av. Simon Bolivar',
    "Administrador",
    'Activo'
);

/*******Query para añadir empleados. En caso de error revisar el correo electronico,usuario y cédula*/
insert into empleadoBancoTable (
    db_nombre_apellido_empleado,
    db_cedula_empleado,
    db_correo_electronico_empleado,
    db_usuario_empleado,
    db_contrasena_empleado,
    db_telefono_empleado,
    db_direccion_empleado,
	db_rol_empleado,
    db_estado_empleado
) values (
    'Juan Pérez',
    '0912345678',
    'juanPe@gmail.com',
    '2',
    '2',
    '0915942138',
    'Av. Colón 123',
    "Empleado",
    'Activo'
);

/*Query para ver solo la cuenta del empleado segun el id
SELECT * FROM empleadoBancoTable
WHERE id_empleado = ?;
*/

/****************Query para modificar datos de los empleados. Debe asegurase que la ID(id_empleado) 
sea siempre la correcta antes de cualquier cambio y llenar los datos del administrador responsable*/
/*
UPDATE empleadoBancoTable
SET
	db_nombre_apellido_empleado = "Miguel Rojas",
    db_correo_electronico_empleado = '2',
    db_contrasena_empleado = '2',
    db_estado_empleado = 'Suspendido',
    
    db_administrador_usuario_cambios = '1',
    db_administrador_nombre_cambios = 'Maria loiza',
    db_fecha_empleado_cambios = NOW()
WHERE db_usuario_empleado = '2';
*/

/*Query para ver todos los empleados*/
select * from empleadoBancoTable;


/********************TABLA DE LOS FONDOS QUE GENERA EL BANCO AL ACTIVAR CUENTAS Y  TRANSACCIONES**********************/
create table bancoFondosTable (
    id_monto_banco int auto_increment,
    db_nombre_banco varchar(100) not null,
    db_cuenta_realizo_transaccion varchar(100),
    db_empleado_aprobatorio varchar(100),
    db_transaccion_incremento varchar(100),
    db_dinero_total_banco decimal(12,2) not null,
    db_fecha_cambio_fondos_banco timestamp default current_timestamp,
    constraint primary key (id_monto_banco)
);

/*Query para crear el saldo del banco desde la base de datos*/
insert into bancoFondosTable (
    db_nombre_banco,
    db_transaccion_incremento,
    db_dinero_total_banco
) values (
    'NeoBank',
    "Monto Inicial",
    1000.00
);

/*Query para revisar el historial del monto del banco*/
Select * from bancoFondosTable;


