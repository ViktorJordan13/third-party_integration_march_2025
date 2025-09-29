const sendMail = require('../services/mailer'); 
const { validate, MailgunFields } = require('../../pkg/mailgun/validate');

const sendWelcomeMail = async (req, res) => {
    try {
        await validate(req.body, MailgunFields);
        const result = await sendMail(req.body.to, "WELCOME", req.body.message);
        return res.status(200).send(result);
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

const sendResetPasswordMail = async (req, res) => {
    try {
        const result = await sendMail(req.body.to, "PASSWORD_TEMPLATE", req.body.message);
        return res.status(200).send(result);
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

module.exports = {
    sendWelcomeMail,
    sendResetPasswordMail,
}
