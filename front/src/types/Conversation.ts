export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

export interface Message {
	id: number;
	conversation_id: number;
	sender_id: number;
	content: string;
	is_read: boolean;
	created_at: string;
	updated_at: string;
	sender?: User;
}

export interface Conversation {
	id: number;
	title?: string | null;
	is_group: boolean;
	created_at: string;
	updated_at: string;
	users?: User[];
	messages?: Message[];
}

export interface NewConversationPayload {
	title?: string;
	isGroup: boolean;
	userIds: number[];
}

export interface NewMessagePayload {
	conversationId: number;
	content: string;
}
