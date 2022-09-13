const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const modifyUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const { name, email, password } = req.body;

        if (!(name, email, password)) {
            throw generateError('Si no vas a hacer nada pa que tocas', 400);
        }

        const [user] = await connection.query(
            `select name, email, password from user where id = ?`,
            [idUser]
        );

        await connection.query(
            `update user set name = ?, email = ?, password = ?`,
            [
                name || user[0].name,
                email || user[0].email,
                password || user[0].password,
                idUser,
            ]
        );

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

module.exports = modifyUser;
