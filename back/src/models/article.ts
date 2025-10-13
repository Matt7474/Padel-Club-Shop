import { DataTypes, JSONB, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Article extends Model {
	public article_id!: number;
	public type!: string | null;
	public name!: string;
	public description!: string | null;
	public reference!: string | null;
	public brand_id!: number | null;
	public price_ttc!: number;
	public stock_quantity!: number;
	public status!: string | null;
	public shipping_cost!: number | null;
	public is_deleted!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Article.init(
	{
		article_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			field: "article_id",
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: "type",
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: "name",
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: "description",
		},
		reference: {
			type: DataTypes.TEXT,
			allowNull: true,
			unique: true,
			field: "reference",
		},
		brand_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "brands",
				key: "brand_id",
			},
		},
		price_ttc: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			field: "price_ttc",
		},
		stock_quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "stock_quantity",
		},
		status: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: "status",
			validate: {
				isIn: [["available", "preorder", "out_of_stock"]],
			},
		},
		shipping_cost: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			field: "shipping_cost",
		},
		tech_characteristics: {
			type: DataTypes.JSONB,
			allowNull: true,
			field: "tech_characteristics",
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
		tableName: "articles",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
