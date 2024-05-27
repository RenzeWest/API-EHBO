const secretkey = process.env.JWT_SECRET || 'DitIsEenGeheim'

const config = {
    secretkey: secretkey,

    dbHost: 'localhost',
    dbUser: 'app_user',
    dbDatabase: 'database_name'
}

module.exports = config
