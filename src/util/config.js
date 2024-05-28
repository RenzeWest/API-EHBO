require('dotenv').config();
const secretkey = process.env.JWT_SECRETKEY || 'DitIsEenGeheim';

const config = {
    secretkey: secretkey,

    dbHost: 'localhost',
    dbUser: 'app_user',
    dbDatabase: 'database_name'
}

module.exports = config
