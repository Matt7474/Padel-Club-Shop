import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Message extends Model {
	public id!: number;
	public sender_id!: number;
	public receiver_id!: number | null;
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
		sender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		receiver_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
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
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);
