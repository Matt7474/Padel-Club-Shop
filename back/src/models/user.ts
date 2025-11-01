import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import type { Address } from "./adress";

export class User extends Model {
	public user_id!: number;
	public last_name!: string;
	public first_name!: string;
	public phone!: string;
	public email!: string;
	public password!: string;
	public role_id!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public addresses?: Address[];
	public id!: number;
}

User.init(
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			field: "user_id",
		},
		last_name: { type: DataTypes.TEXT, allowNull: false },
		first_name: { type: DataTypes.TEXT, allowNull: false },
		phone: DataTypes.TEXT,
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: { type: DataTypes.TEXT, allowNull: false },
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "roles", key: "role_id" },
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
