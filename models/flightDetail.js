'use strict';
import { DataTypes, Model } from 'sequelize';

const flightDetail = (sequelize, DataTypes) => {
  class flightDetail extends Model {
    // static associate(models) {
    //   flightDetail.belongsTo(models.user, {
    //     foreignKey: 'user_id'
    //   });
    // }
  }

  flightDetail.init(
    {
      task: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: DataTypes.STRING,
      desciption: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'flightDetail',
      tableName: 'flightDetails',
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  );
  return flightDetail;
};

export default flightDetail;

//     task: data.task,
//     status: data.status,
//     description: data.description,
//     user_id: request.user.id
