import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class ArticleImage extends Model {
	public image_id!: number;
	public article_id!: number;
	public url!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

ArticleImage.init(
	{
		image_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		article_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "article_images",
		timestamps: true,
		underscored: true,
	},
);
