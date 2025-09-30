const express = require('express');
const { expressjwt: jwt } = require('express-jwt');

const config = require('./pkg/config');
require('./pkg/db');

const {
    sendWelcomeMail,
    sendResetPasswordMail
} = require('./handlers/mailer');

const { 
    login,
    register,
    refreshToken,
    forgetPassword,
    resetPassTemplate,
    resetPassword 
} = require('./handlers/auth');

const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.set("view engine", "ejs");

api.use(
    "/api",
    jwt({
        secret: config.getSection('development').jwt_key,
        algorithms: ["HS256"],
    }).unless({
        path: [
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/forget-password",
        ],
    })
)

api.get('/api/v1/auth/refresh-token', refreshToken);
api.post('/api/v1/auth/register', register);
api.post('/api/v1/auth/login', login);

api.get('/forgot-password', (req, res) =>{
    res.render("forgot_password");
});

api.post('/api/v1/auth/forget-password', forgetPassword);

api.get('/reset-password/:id/:token', resetPassTemplate);
api.post('/reset-password/:id/:token', resetPassword);

api.post('/api/v1/welcome-mail', sendWelcomeMail);
api.post('/api/v1/reset-password-mail', sendResetPasswordMail);

api.use(function (err, req, res, next){
    if(err.name === "UnauthorizedAccess"){
        res.status(401).send("Invalid token.");
    }
});

api.listen(config.getSection('development').port, (err) => {
    err 
        ? console.log(err) 
        : console.log(
            `Server is running on port ${config.getSection('development').port}`
        )     
});