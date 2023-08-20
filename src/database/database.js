import mysql from "promise-mysql";
import config from "../config";

const pool = mysql.createPool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    connectionLimit: 10 // Puedes ajustar este valor según las necesidades de tu aplicación
});

const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        connection.release(); // Devuelve la conexión al pool después de obtenerla
        return pool;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getConnection
};
