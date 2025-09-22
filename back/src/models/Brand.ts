import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Brand extends Model {
	public brand_id!: number;
	public name!: string;
	public logo!: string | null;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Brand.init(
	{
		brand_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: "brand_id",
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
			field: "name",
		},
		logo: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: "logo",
		},
	},
	{
		sequelize,
		tableName: "brands",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
