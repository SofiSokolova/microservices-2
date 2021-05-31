import { Op, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserRolesEnum } from '../../user/types';
import { configInstance } from '../../core/config';
import { HashService } from '../../services/hash/hash.service';
import { userTableName } from '../migrations/1618243821627_user';

const usersToCreate = [
  {
    email: 'kours.d2@gmail.com',
    password: configInstance.seed.UserPassword,
    firstName: 'Sofi',
    lastName: 'Sokolova',
    role: UserRolesEnum.ADMIN,
  },
  {
    email: 'sofiia.sokolova.dev@gmail.com',
    password: configInstance.seed.UserPassword,
    firstName: 'Sofi2',
    lastName: 'Sokolova2',
    role: UserRolesEnum.DEFAULT,
  },
];

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    const hashService = new HashService(configInstance);
    const createUsers = await Promise.all(
      await usersToCreate.map(async (user) => {
        const password = await hashService.generateHash(user.password);
        return {
          ...user,
          password,
        };
      }),
    );
    await queryInterface.bulkInsert(userTableName, createUsers, { raw: true });
  },

  async down(
    queryInterface: QueryInterface,
    sequelize: Sequelize,
  ): Promise<void> {
    await queryInterface.bulkDelete(userTableName, {
      email: {
        [Op.in]: usersToCreate.map((user) => user.email),
      },
    });
  },
};
