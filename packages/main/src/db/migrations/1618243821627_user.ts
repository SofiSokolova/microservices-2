import { QueryInterface } from 'sequelize';
import { DataType, Sequelize } from 'sequelize-typescript';
import { UserRolesEnum } from '../../user/types';

export const userTableName = 'user';

export default {
  async up(queryInterface, sequelize: Sequelize): Promise<void> {
    return queryInterface.createTable(userTableName, {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
      },
      confirmed: {
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataType.ENUM({ values: Object.values(UserRolesEnum) }),
        allowNull: false,
        defaultValue: UserRolesEnum.DEFAULT,
      },
      firstName: {
        type: DataType.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataType.STRING,
        allowNull: false,
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataType.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: DataType.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: {
        type: DataType.DATE,
        defaultValue: null,
      },
    });
  },
  async down(
    queryInterface: QueryInterface,
    sequelize: Sequelize,
  ): Promise<void> {
    return queryInterface.dropTable(userTableName);
  },
};
