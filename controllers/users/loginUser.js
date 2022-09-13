const getDB = require('../../db/getDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../../helpers');
require('dotenv').config();

const loginUser = async (req, res, next) => {
    let connection;

    try {
        // establecemos una conexion a la base de datos
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos obligatorios', 400);
        }

        const [user] = await connection.query(
            `SELECT id, email, password FROM users WHERE email = ?`,
            [email]
        );
        console.log(user);

        if (user.length < 1) {
            throw generateError(
                'No existe un usuario registrado con ese email',
                404
            );
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            throw generateError('La contraseña es incorrecta', 401); // Unauthorized
        }

        const tokenInfo = {
            id: user[0].id,
        };

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '10d',
        });

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
