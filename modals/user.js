const jwt = require('jsonwebtoken')
const { sequelize, DataTypes } = require('../config/db')


module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
        firstname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        mobile_number: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },

    },
        {
            tableName: "user",
            timestamps: false,
        });

    return user;
};