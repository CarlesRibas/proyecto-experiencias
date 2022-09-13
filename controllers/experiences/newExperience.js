const getDB = require('../../db/getDB');
const { generateError, validate } = require('../../helpers');
const newExperienceSchema = require('../../schemas/newExperienceSchema');

const newExperience = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { title, entry, text, place } = req.body;

        /*  await validate(newExperienceSchema, req.body); */

        const idReqUser = req.userAuth.id;

        if (!title || !text || !entry) {
            throw generateError('Debes indicar los campos obligatorios', 400);
        }

        const [{ insertId }] = await connection.query(
            `INSERT INTO recomendaciones (title, entry, text, created_at, users_id, place)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, entry, text, new Date(), idReqUser, place]
        );

        res.send({
            status: 'Ok',
            message: 'Experiencia insertada con éxito!',
            data: { id: insertId, title, entry, text, place },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newExperience;
