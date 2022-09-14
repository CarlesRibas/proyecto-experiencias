const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

const editUserPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { oldPass, newPass } = req.body;

        if (!oldPass || !newPass) {
            throw generateError(
                'Debes indicar la contraseña antigua y la nueva para el cambio',
                400
            );
        }

        const [user] = await connection.query(
            `select password from users where id =?`,
            [idUser]
        );

        const isValid = await bcrypt.compare(oldPass, user[0].password);

        if (!isValid) {
            throw generateError('La contraseña antigua no coincide', 401);
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);

        await connection.query(`update users set password = ? where id = ?`, [
            hashedPassword,
            idUser,
        ]);

        res.send({
            status: 'Ok',
            message: 'Contraseña actualizada con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserPassword;
