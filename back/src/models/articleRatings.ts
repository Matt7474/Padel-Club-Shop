import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class ArticleRatings extends Model {
	public rating_id!: number;
	public article_id!: number;
	public maneuverability?: number;
	public power?: number;
	public comfort?: number;
	public spin?: number;
	public tolerance?: number;
	public control?: number;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

ArticleRatings.init(
	{
		rating_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		article_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "articles", key: "article_id" },
			onDelete: "CASCADE",
		},
		maneuverability: { type: DataTypes.INTEGER, allowNull: true },
		power: { type: DataTypes.INTEGER, allowNull: true },
		comfort: { type: DataTypes.INTEGER, allowNull: true },
		spin: { type: DataTypes.INTEGER, allowNull: true },
		tolerance: { type: DataTypes.INTEGER, allowNull: true },
		control: { type: DataTypes.INTEGER, allowNull: true },
	},
	{
		sequelize,
		tableName: "article_ratings",
		timestamps: false,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
