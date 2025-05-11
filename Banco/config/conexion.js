import mysql from "mysql2";

const conexion = mysql.createConnection({
    host: "localhost",
    database: "db_banco",
    user: "root",
    password: "Balatro",
})

conexion.connect((error)=>{
    if(error){
        console.error("Error",error)
    }else{
        console.log("Conexion exitosa")
    }
})

export default conexion;