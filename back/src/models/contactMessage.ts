import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import type {
	ContactMessageAttributes,
	ContactMessageCreationAttributes,
} from "../types/ContactMessage";

class ContactMessage
	extends Model<ContactMessageAttributes, ContactMessageCreationAttributes>
	implements ContactMessageAttributes
{
	public id!: number;
	public user_id?: number | null;
	public first_name!: string;
	public last_name!: string;
	public email!: string;
	public phone?: string | null;
	public subject!:
		| "general"
		| "order"
		| "product"
		| "complaint"
		| "partnership"
		| "other";
	public order_number?: string | null;
	public message!: string;
	public response?: string | null;
	public status!: "new" | "in_progress" | "resolved" | "closed";
	public is_read!: boolean;
	public is_deleted!: boolean;
	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

// Définition du modèle Sequelize
ContactMessage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		first_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		subject: {
			type: DataTypes.ENUM(
				"general",
				"order",
				"product",
				"complaint",
				"partnership",
				"other",
			),
			allowNull: false,
		},
		order_number: {
			type: DataTypes.STRING(17),
			allowNull: true,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		response: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("new", "in_progress", "resolved", "closed"),
			allowNull: false,
			defaultValue: "new",
		},
		is_read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
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
		tableName: "contact_messages",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);

export default ContactMessage;
