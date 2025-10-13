import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import type {
	PromotionsAttributes,
	PromotionsCreationAttributes,
} from "../types/PromotionType";

export class Promotions
	extends Model<PromotionsAttributes, PromotionsCreationAttributes>
	implements PromotionsAttributes
{
	public promo_id!: number;
	public article_id!: number;
	public name!: string | null;
	public description!: string | null;
	public discount_type!: "amount" | "%";
	public discount_value!: number;
	public start_date!: string | Date;
	public end_date!: string | Date;
	public status?: "active" | "upcoming" | "expired";

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Définition du modèle
Promotions.init(
	{
		promo_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		article_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "articles",
				key: "article_id",
			},
			onDelete: "CASCADE",
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		discount_type: {
			type: DataTypes.ENUM("amount", "percent"),
			allowNull: false,
			defaultValue: "percent",
		},
		discount_value: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("active", "upcoming", "expired"),
			allowNull: true,
		},
	},
	{
		tableName: "promotions",
		sequelize,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
