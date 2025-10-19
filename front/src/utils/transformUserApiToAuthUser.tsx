import type { AuthUser, UserApiResponse } from "../types/User";

const ROLE_MAP: Record<number, string> = {
	1: "super admin",
	2: "admin",
	3: "client",
};

export function transformUserApiToAuthUser(apiUser: UserApiResponse): AuthUser {
	return {
		id: apiUser.user_id,
		firstName: apiUser.first_name,
		lastName: apiUser.last_name,
		email: apiUser.email,
		role: ROLE_MAP[apiUser.role_id] || "client",
		addresses: apiUser.addresses,
	};
}
