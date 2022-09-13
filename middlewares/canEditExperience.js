const getDB = require('../db/getDB');
const { generateError } = require('../helpers');

const canEditExperience = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExperience } = req.params;

        const idReqUser = req.userAuth.id;

        const [user] = await connection.query(
            `select * from experience where id = ? and idUser = ?`,
            [idExperience, idReqUser]
        );

        if (user.lenght < 1) {
            throw generateError(
                'No eres el propietario del producto a editar',
                401
            );
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = canEditExperience;
