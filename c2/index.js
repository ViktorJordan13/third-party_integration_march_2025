const express = require('express');

const config = require('./pkg/config');

const {
    sendWelcomeMail,
    sendResetPasswordMail
} = require('./handlers/mailer');

const api = express();
api.use(express.json());

api.post('/api/v1/welcome-mail', sendWelcomeMail);
api.post('/api/v1/reset-password-mail', sendResetPasswordMail);

api.listen(config.getSection('development').port, (err) => {
    err 
        ? console.log(err) 
        : console.log(
            `Server is running on port ${config.getSection('development').port}`
        )     
});