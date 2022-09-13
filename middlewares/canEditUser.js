const getDB = require('../db/getDB');
const { generateError } = require('../helpers');

const canEditUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        const idReqUser = req.userAuth.id;

        if (Number(idUser) !== idReqUser) {
            throw generateError(
                'No eres el propietario del usuario a editar',
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

module.exports = canEditUser;
