"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}
  Course.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      estimatedTime: DataTypes.STRING,
      materialsNeeded: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull:false,
      },
    });
  };
  return Course;
};
