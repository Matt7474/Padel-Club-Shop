import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Message extends Model {
	public id!: number;
	public conversation_id!: number;
	public sender_id!: number;
	public content!: string;
	public is_read!: boolean;
	public created_at!: Date;
	public updated_at!: Date;
}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		conversation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "conversations", key: "id" },
		},
		sender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		is_read: {
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
		tableName: "messages",
		timestamps: false,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
