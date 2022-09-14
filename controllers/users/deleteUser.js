const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

const deleteUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { password } = req.body;

        if (!password) {
            throw generateError(
                'Debes indicar la contraseña para eliminar al usuario',
                400
            );
        }

        const [user] = await connection.query(
            `select password from users where id = ?`,
            [idUser]
        );

        const isValid = await bcrypt.compare(password, user[0].password);

        if (!isValid) {
            throw generateError(
                'La contraseña no es correcta, no puede eliminar al usuario',
                401
            );
        }

        await connection.query(`delete from users where id = ?`, [idUser]);

        res.send({
            status: 'Ok',
            message: 'Usuario eliminado!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteUser;
