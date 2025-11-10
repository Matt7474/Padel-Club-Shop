"use strict";
// import { DataTypes, Model } from "sequelize";
// import { sequelize } from "../database/db";
// export class ConversationUser extends Model {
// 	public id!: number;
// 	public conversation_id!: number;
// 	public user_id!: number;
// 	public joined_at!: Date;
// 	public created_at!: Date;
// 	public updated_at!: Date;
// }
// ConversationUser.init(
// 	{
// 		id: {
// 			type: DataTypes.INTEGER,
// 			autoIncrement: true,
// 			primaryKey: true,
// 		},
// 		conversation_id: {
// 			type: DataTypes.INTEGER,
// 			allowNull: false,
// 			references: { model: "conversations", key: "id" },
// 		},
// 		user_id: {
// 			type: DataTypes.INTEGER,
// 			allowNull: false,
// 			references: { model: "users", key: "id" },
// 		},
// 		joined_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 		created_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 		updated_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 	},
// 	{
// 		sequelize,
// 		tableName: "conversation_user",
// 		timestamps: false,
// 		createdAt: "created_at",
// 		updatedAt: "updated_at",
// 	},
// );
