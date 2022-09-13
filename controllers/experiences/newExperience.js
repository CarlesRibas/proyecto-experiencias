const getDB = require('../../db/getDB');
const { generateError, validate } = require('../../helpers');
const newExperienceSchema = require('../../schemas/newExperienceSchema');

const newExperience = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Recuperar los datos del body de la request
        const { title, entry, text } = req.body;

        // Validar los datos que recibimos usando el squema
        await validate(newExperienceSchema, req.body);

        // Necesitamos el id del usuario para asignarselo al producto
        // como propietario del mismo
        const idReqUser = req.userAuth.id;

        // Ya comprobamos que name y price son obligatorios en el schema

        // Si falta alguno de los campos obligatorios damos un error
        if (!title || !text || !entry) {
            throw generateError('Debes indicar los campos obligatorios', 400);
        }

        // Si nos inidica el nombre y precio, insertamos el nuevo producto
        const [{ insertId }] = await connection.query(
            `INSERT INTO recomendaciones (title, entry, text, createdAt, idUser)
            VALUES (?, ?, ?, ?, ?)`,
            [title, entry, text, new Date(), idReqUser]
        );

        res.send({
            status: 'Ok',
            message: 'Experiencia insertado con éxito!',
            data: { id: insertId, title, entry, text },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newExperience;
