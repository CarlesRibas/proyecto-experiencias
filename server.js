require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const loginUser = require('./controllers/users/loginUser');

const app = express();

app.use(express.json());
app.use(morgan('dev'));




//#### ENDPOINTS USER #####

//registro de user

//login user
app.post('/login', loginUser)

//devuelve info del user

//##### ENDPOINTS RECOMENDACIONES #####

//lista de las recomendaciones

//nueva recomendacion

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
    console.log('Server listening at: localhost://3000');
});
