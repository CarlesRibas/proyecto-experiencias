const getDB = require('../../db/getDB');
const bcrypt = require('bcrypt');
const { generateError } = require('../../helpers');

const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            throw generateError('Faltan campos obligatorios', 400);
        }

        const [user] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        if (user.length > 0) {
            throw generateError('Ya existe un usuario con ese email.', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            `INSERT INTO users (name, email, password, created_at)
            VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, new Date()]
        );

        res.send({
            status: 'Ok',
            message: 'Usuario creado con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newUser;
