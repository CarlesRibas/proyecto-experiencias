require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const { newUserController } = require('./controllers/user/newUser');
const { getUserController } = require('./controllers/user/getUser');
const { loginController } = require('./controllers/user/loginUser');

const {
    getRecomendacionesController,
} = require('./controllers/recomendaciones/getRecomendaciones');
const {
    newRecomendacionesController,
} = require('./controllers/recomendaciones/newRecomendaciones');
const {
    getRecomendacionController,
} = require('./controllers/recomendaciones/getRecomendacion');
const {
    deleteRecomendacionesController,
} = require('./controllers/recomendaciones/deleteRecomendacion');

const app = express();

app.use(express.json());
app.use(morgan('dev'));



//#### ENDPOINTS USER #####

//registro de user
app.post('/user', newUserController);
//login user
app.post('/login', loginController);
//devuelve info del user
app.get('/user/:id', getUserController);



//##### ENDPOINTS RECOMENDACIONES #####

//lista de las recomendaciones
app.get('/', getRecomendacionesController);
//nueva recomendacion
app.post('/', newRecomendacionesController);
//devuelve una recomendacion
app.get('/recomendaciones/:id', getRecomendacionController);
//borrar recomendacion
app.delete('/recomendaciones/:id', deleteRecomendacionesController);





// Middlewares notFound y error
app.use((req, res) => {
    res.status(404).send({
        status: 'Error',
        message: 'Not found',
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'Error',
        message: error.message,
    });
});

app.listen(3000, () => {
    console.log('Server listening at: localhost://3000');
});
