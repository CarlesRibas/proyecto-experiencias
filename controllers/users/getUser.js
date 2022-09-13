const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const getUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const [[user]] = await connection.query(
            `SELECT id, name, email, created_at, avatar FROM users WHERE id = ?`,
            [idUser]
        );

        if (!user) {
            throw generateError('No existe el usuario seleccionado', 404); // Not found
        }

        const [userRecomendaciones] = await connection.query(
            `SELECT * FROM recomendaciones WHERE id = ?`,
            [idUser]
        );

        for (let i = 0; i < userRecomendaciones.length; i++) {
            const [experience] = await connection.query(
                `SELECT tittle FROM recomendaciones WHERE idUser = ?`,
                [userRecomendaciones[i].id]
            );

            userRecomendaciones[i].experience = experience;
        }

        res.send({
            status: 'Ok',
            data: { ...user, userRecomendaciones },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getUser;
