const jwt = require('jsonwebtoken');

const createTokenUser = ({user}) => {
    const token = jwt.sign({user}, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN)
}