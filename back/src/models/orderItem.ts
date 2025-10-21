import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class OrderItem extends Model {
	public order_line_id!: number;
	public order_id!: number;
	public article_id!: number;
	public quantity!: number;
	public price!: number;
	public size!: string | null;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

OrderItem.init(
	{
		order_line_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: "order_line_id",
		},
		order_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "order_id",
		},
		article_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "article_id",
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "quantity",
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			field: "price",
		},
		size: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: "size",
		},
	},
	{
		sequelize,
		tableName: "order_lines",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
