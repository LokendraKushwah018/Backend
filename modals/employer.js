const { sequelize, Sequelize } = require('../config/db');

module.exports = (sequelize, Sequelize) => {
    const Employer = sequelize.define("Employer", {
        firstname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        mobile_number: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: "Employer",
        timestamps: false,
    });
    return Employer;
};