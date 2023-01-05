"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required",
          },
          notEmpty: {
            msg: "Please provide a title",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required",
          },
          notEmpty: {
            msg: "Please provide a description",
          },
        },
      },
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
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};
