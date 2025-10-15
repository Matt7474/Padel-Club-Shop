import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Role extends Model {
	public role_id!: number;
	public label!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Role.init(
	{
		role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		label: { type: DataTypes.TEXT, allowNull: false, unique: true },
	},
	{
		sequelize,
		tableName: "roles",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
