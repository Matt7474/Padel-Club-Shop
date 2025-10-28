import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Conversation extends Model {
	public id!: number;
	public title!: string | null;
	public is_group!: boolean;
	public created_at!: Date;
	public updated_at!: Date;
}

Conversation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		is_group: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		tableName: "conversations",
		timestamps: false,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
