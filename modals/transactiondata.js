const jwt = require('jsonwebtoken')
const { sequelize, DataTypes } = require('../config/db')


module.exports = (sequelize, Sequelize) => {
    const transaction = sequelize.define("transaction", {
        username: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        userId: {
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
            tableName: "transaction",
            timestamps: false,
        });

    return transaction;
};