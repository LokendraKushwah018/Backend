module.exports = (sequelize, Sequelize) => {
    const custom = sequelize.define("custom", {
        firstname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        aadhar_card: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pan_card: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        mobile_number: {
            type: Sequelize.INTEGER,
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
            tableName: "custom",
            timeStamp: false
        });

    return custom;
};