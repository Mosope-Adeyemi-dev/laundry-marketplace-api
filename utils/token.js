const jwt  = require('jsonwebtoken')

const checkJwt = async (jwtID) => {
    try {
        return jwt.verify(jwtID, process.env.JWT_KEY);
      } catch (error) {
        return { err: error.message };
    }
}

const createToken = async (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_KEY, {
        expiresIn: "1d",
    });
}

module.exports = {
    checkJwt,
    createToken
}