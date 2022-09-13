require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

//##### MIDDLEWARES #####
const isAuth = require('./middlewares/isAuth');
const canEditUser = require('./middlewares/canEditUser');
const canEditExperience = require('./middlewares/canEditExperience');

//##### CONTROLADORES USUARIO #####
const newUser = require('./controllers/users/newUser');
const loginUser = require('./controllers/users/loginUser');
const modifyUser = require('./controllers/users/modifyUser');
const getUser = require('./controllers/users/getUser');

//##### CONTROLADORES EXPERIENCIA #####
const newExperience = require('./controllers/experiences/newExperience');

//#### ENDPOINTS USER #####

//registro de user
app.post('/register', newUser);

//login user
app.post('/login', loginUser);

// Modificar name, email y password del usuario
app.put('/users/:idUser', isAuth, canEditUser, modifyUser);

//devuelve info del user
app.get('/users/:idUser', getUser);
//##### ENDPOINTS RECOMENDACIONES #####

//lista de las recomendaciones

//nueva recomendacion
app.post('/experiences/new', isAuth, newExperience);

//devuelve una recomendacion

//borrar recomendacion

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
    console.log('Server listening at: localhost://3000 AHORA LO BORRAS');
});
