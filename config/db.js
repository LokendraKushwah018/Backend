const env = require("./dbConfig.js");
// const mysql = require('mysql');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    logging: false,
    pool: {
        min: 0,
        max: 5,
        idle: 10000,
    },
});

sequelize.authenticate().then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Error connecting to database:', err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// //Models
db.user = require("../modals/user.js")(sequelize, DataTypes)
db.custom = require("../modals/customdata.js")(sequelize, DataTypes)
db.Employer = require("../modals/employer.js")(sequelize, DataTypes)
db.transaction = require("../modals/transactiondata.js")(sequelize, DataTypes)


db.user.hasMany(db.transaction, {
    foreignkey: 'userId',
    as: "transaction",
    sourceKey: "id"
})

module.exports = db;
