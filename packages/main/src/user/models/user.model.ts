import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Unique,
  AutoIncrement,
  AllowNull,
  Default,
  BeforeUpdate,
} from 'sequelize-typescript';
import { UserRolesEnum, UserScopesEnum } from '../types';
import { FindOptions } from 'sequelize';
import { userTableName } from '../../db/migrations/1618243821627_user';
import * as bcrypt from 'bcrypt';
import { configInstance } from '../../core/config';

@Table({
  tableName: userTableName,
  underscored: false,
  defaultScope: {
    attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
  },
  scopes: {
    [UserScopesEnum.LOGIN]: (): FindOptions => ({
      attributes: [
        'id',
        'email',
        'confirmed',
        'password',
        'firstName',
        'lastName',
        'role',
        'createdAt',
      ],
    }),
  },
  paranoid: false,
})
export class UserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  confirmed: boolean;

  @AllowNull(false)
  @Default(UserRolesEnum.DEFAULT)
  @Column(DataType.ENUM({ values: Object.values(UserRolesEnum) }))
  role: UserRolesEnum;

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;

  @BeforeUpdate
  static async generatePasswordHash(user: UserModel) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(
        user.password,
        await bcrypt.genSalt(configInstance.hash.saltRound),
      );
    }
  }
}
