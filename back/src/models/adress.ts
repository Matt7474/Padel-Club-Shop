import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Address extends Model {
	public address_id!: number;
	public user_id!: number;
	public type!: string;
	public street_number!: number;
	public street_name!: string;
	public complement!: string;
	public zip_code!: string;
	public city!: string;
	public country!: string;
	public is_default!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Address.init(
	{
		address_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "user_id" },
		},
		type: {
			type: DataTypes.TEXT,
			validate: { isIn: [["shipping", "billing"]] },
		},
		street_number: DataTypes.TEXT,
		street_name: DataTypes.TEXT,
		complement: DataTypes.TEXT,
		zip_code: DataTypes.TEXT,
		city: DataTypes.TEXT,
		country: DataTypes.TEXT,
		is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		sequelize,
		tableName: "addresses",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
