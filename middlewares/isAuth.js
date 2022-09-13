const getDB = require('../db/getDB');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
require('dotenv').config();

// Comprueba que existe la cabecera de autorizacion y el usuario está logueado
const isAuth = async (req, res, next) => {
    // Los middleware NO envian una respuesta, dejan pasar la peticion -> next()
    let connection;

    try {
        connection = await getDB();

        // Obtener la cabecera de autorizacion donde va a ir el token
        const { authorization } = req.headers;

        // Si no indica la cabecera de autorizacion lanzaremos un error
        if (!authorization) {
            throw generateError('Falta la cabecera de autorizacion', 401); // Unauthorized
        }

        // Variable que almacenará la info del token
        let tokenInfo;

        // Desencriptar el token (cabecera de autorizacion) recibida
        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            // Si el token no es valido, no es generado por nosotros
            throw generateError('No has iniciado sesion', 401);
        }

        // El token devuelve un id, seleccionamos de la base de datos al usuario con ese id
        const [user] = await connection.query(
            `SELECT * FROM users WHERE id = ?`,
            [tokenInfo.id]
        );

        // Si no hubiera un usuario con ese id en la base de datos lanzariamos un error
        if (user.length < 1) {
            throw generateError('El token no es válido', 401);
        }

        // Si el usuario existe, y el token es válido, creamos en la request una propiedad que guardará
        // el id del usuario que ha hecho login
        req.userAuth = tokenInfo;

        // Pasamos la pelota
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release(); // Si existe la conexion -> la cierras
    }
};

module.exports = isAuth;
