const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { name, email } = req.body;

        if (!(name || email)) {
            throw generateError('Si no vas a hacer nada pa que tocas', 400);
        }

        const [user] = await connection.query(
            `select name, email from users where id = ?`,
            [idUser]
        );

        await connection.query(`update users set name = ?, email = ?`, [
            name || user[0].name,
            email || user[0].email,
            idUser,
        ]);

        res.send({
            status: 'Ok',
            message: 'Datos del usuario modificados con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUser;
