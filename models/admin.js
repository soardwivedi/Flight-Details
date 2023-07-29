'use strict';
import { DataTypes, Model } from 'sequelize';
import * as bcrypt from 'bcrypt';

const admin = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {}
  }

  admin.init(
    {
      name: {
        type: DataTypes.UUID,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      access_token: {
        type: DataTypes.STRING
      },
      refresh_token: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'admin',
      tableName: 'admins',
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  );

  admin.beforeSave(async (admin, options) => {
    try {
      console.log(admin, 'uuuuuuuuuuuuuuuuuuuuuuuuuuu');
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedPassword;
    } catch (error) {
      console.log('Password could not be encrypted.');
    }
  });

  admin.beforeUpdate(async (admin, options) => {
    try {
      console.log(admin, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

      const hashedUpdatedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedUpdatedPassword;
    } catch (error) {
      console.log('Password could not be encrypted.');
    }
  });

  return admin;
};
export default admin;
