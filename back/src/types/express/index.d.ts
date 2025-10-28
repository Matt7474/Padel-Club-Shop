import type { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
	id: number;
	email: string;
	role_id: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: UserPayload;
		}
	}
}
