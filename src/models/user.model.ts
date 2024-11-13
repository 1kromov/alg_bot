import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  user_id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year_old!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region!: string
}
