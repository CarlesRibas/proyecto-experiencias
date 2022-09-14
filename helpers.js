/*
const { unlink } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const avatarDir = path.join(__dirname, 'static/avatars');
const experiencesDir = path.join(__dirname, 'static/experiences');
*/

const generateError = (message, status) => {
    const error = new Error(message);
    error.httpStatus = status;
    return error;
};

/*
async function savePhoto(imagen, type) {
    try {
        const sharpImage = sharp(image.data);

        let imageDirectory;

        const imageName = uuid.v4() + '.jpg';

        if (type == 0) {
            imageDirectory = path.join(avatarDir, imageName);

            sharpImage.resize(150, 150);
        } else if (type === 1) {
            imageDirectory = path.join(ExperiencesDir, imageName);
        }

        await sharpImage.toFile(imageDirectory);

        return imageName;
    } catch (error) {
        throw new Error('Error al procesar la imagen');
    }
}

async function deletePhoto(photoName, type) {
    try {
        let photoPath;

        if (type === 0) {
            photoPath = path.join(avatarsDir, photoName);
        } else if (type === 1) {
            photoPath = path.join(experiencesDir, photoName);
        }
    } catch (error) {
        throw new Error('Error al eliminar la imagen del servidor');
    }
}
*/

module.exports = {
    generateError,
};
