import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../database/db";

interface ContactAttributes {
	id: number;
	user_id?: number | null;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
	status?: "new" | "in_progress" | "resolved" | "closed";
	order_number?: string;
	is_read: boolean;
	response?: string;
	is_deleted?: boolean;
	responded_at?: Date | null;
	admin_notes?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

interface ContactCreationAttributes
	extends Optional<
		ContactAttributes,
		| "id"
		| "phone"
		| "status"
		| "responded_at"
		| "admin_notes"
		| "created_at"
		| "updated_at"
		| "is_read"
	> {}

export class Contact
	extends Model<ContactAttributes, ContactCreationAttributes>
	implements ContactAttributes
{
	public id!: number;
	public user_id?: number;
	public first_name!: string;
	public last_name!: string;
	public email!: string;
	public phone?: string;
	public subject!: string;
	public message!: string;
	public status?: "new" | "in_progress" | "resolved" | "closed";
	public order_number?: string;
	public is_read!: boolean;
	public response?: string;
	public is_deleted!: boolean;
	public responded_at?: Date | null;
	public admin_notes?: string | null;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

Contact.init(
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
			type: DataTypes.TEXT,
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		order_number: {
			type: DataTypes.TEXT,
			allowNull: true,
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
			field: "is_deleted",
		},
		response: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.TEXT,
			defaultValue: "new",
		},
		responded_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.NOW,
		},
		admin_notes: {
			type: DataTypes.TEXT,
			allowNull: true,
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
		timestamps: false,
		underscored: true,
	},
);
