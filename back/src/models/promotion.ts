import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import type {
	PromotionAttributes,
	PromotionCreationAttributes,
} from "../types/PromotionType";

export class Promotion
	extends Model<PromotionAttributes, PromotionCreationAttributes>
	implements PromotionAttributes
{
	public promo_id!: number;
	public name!: string | null;
	public description!: string | null;
	public start_date!: string | Date;
	public end_date!: string | Date;
	public status?: "active" | "upcoming" | "expired";

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Définition du modèle
Promotion.init(
	{
		promo_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
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
		tableName: "promotion",
		sequelize,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
