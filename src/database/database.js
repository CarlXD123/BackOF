import mysql from "promise-mysql";
import config from "../config";

const pool = mysql.createPool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    connectionLimit: 10 // Puedes ajustar este valor según las necesidades de tu aplicación
});

const getPool = () => {
    return pool;
};

module.exports = {
    getPool
};
