import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../database/db";
import { Article } from "./Article";

// Interface TypeScript pour Promotion
interface PromotionAttributes {
	promotion_id: number;
	article_id: number;
	discount_type: "percentage" | "amount" | string;
	discount_value: number;
	description: string;
	start_date: string;
	end_date: string;
	status?: "active" | "expired" | "upcoming";
}

// Pour les champs facultatifs à la création
interface PromotionCreationAttributes
	extends Optional<PromotionAttributes, "promotion_id" | "status"> {}

export class Promotion
	extends Model<PromotionAttributes, PromotionCreationAttributes>
	implements PromotionAttributes
{
	public promotion_id!: number;
	public article_id!: number;
	public discount_type!: "percentage" | "amount" | string;
	public discount_value!: number;
	public description!: string;
	public start_date!: string;
	public end_date!: string;
	public status?: "active" | "expired" | "upcoming";

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Définition du modèle
Promotion.init(
	{
		promotion_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		article_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: "Articles",
				key: "article_id",
			},
			onDelete: "CASCADE",
		},
		discount_type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		discount_value: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "Promotions",
		sequelize,
	},
);

Promotion.belongsTo(Article, { foreignKey: "article_id", as: "article" });
Article.hasMany(Promotion, { foreignKey: "article_id", as: "promotions" });

export default Promotion;
