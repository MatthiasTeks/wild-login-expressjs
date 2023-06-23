const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const hashOptions = {
    type: argon2.argon2d,
    memoryCost: 2 ** 16,
    hashLength: 50,
}

const hashPassword = async (req, res, next) => {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, hashOptions);
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    next();
}

const verifyPassword = async (user, password) => {
    console.log('in verifyPassword', user.password, password);
    const response = await argon2.verify(user.password, password, hashOptions);
    if(response){
        const token = await jwt.sign({sub: user.id_user}, process.env.JWT_SECRET)
        return token;
    }
    return response;
}


module.exports = { hashPassword, verifyPassword }