const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
require('dotenv').config();

const loginUser = async (req, res, next) => {
    let connection;

    try {
        // establecemos una conexion a la base de datos
        connection = await getDB();

        // Obtener los email y password del body
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos obligatorios', 400); // Bad Request
        }

        // Comprobamos que existe un usuario con ese email en la base de datos
        const [user] = await connection.query(
            `SELECT id, email, password FROM users WHERE email = ?`,
            [email]
        );

        // Si no existe un usuario con ese email? Lanzamos un error
        if (user.length < 1) {
            throw generateError(
                'No existe un usuario registrado con ese email',
                404
            ); // Not found
        }

        // Si existe un usuario con ese email comprobamos que las contraseñas coinciden

        const validPassword = await bcrypt.compare(password, user[0].password);

        // Si no coinciden las contraseñas damos un error
        if (!validPassword) {
            throw generateError('La contraseña es incorrecta', 401); // Unauthorized
        }

        // Si el usuario indica un email y contraseña correctos, generaremos un token de inicio de sesion

        // Crear un objeto con la informacion que pasaremos al token
        const tokenInfo = {
            id: user[0].id,
        };

        // Crear el token
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '10d',
        });

        // Enviamos de respuesta el token generado
        res.send({
            status: 'Ok',
            authToken: token,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = loginUser;
