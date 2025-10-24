import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Order extends Model {
	public order_id!: number;
	public reference!: string;
	public user_id!: number;
	public vat_rate!: number;
	public total_amount!: number;
	public status!: "pending" | "paid" | "cancelled" | "shipped";

	public is_deleted!: boolean;
	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

Order.init(
	{
		order_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: "order_id",
		},
		reference: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
			field: "reference",
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "user_id",
		},
		vat_rate: {
			type: DataTypes.DECIMAL(5, 2),
			defaultValue: 20,
			field: "vat_rate",
		},
		total_amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0,
			field: "total_amount",
		},
		status: {
			type: DataTypes.ENUM(
				"paid",
				"processing",
				"ready",
				"shipped",
				"cancelled",
			),
			defaultValue: "paid",
			field: "status",
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: "is_deleted",
		},
	},
	{
		sequelize,
		tableName: "orders",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
