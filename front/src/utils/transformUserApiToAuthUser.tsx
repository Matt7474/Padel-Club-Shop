import type { AuthUser, UserApiResponse } from "../types/User";

export function transformUserApiToAuthUser(apiUser: UserApiResponse): AuthUser {
	return {
		id: apiUser.user_id,
		firstName: apiUser.first_name,
		lastName: apiUser.last_name,
		email: apiUser.email,
		role: apiUser.role_id,
		addresses: apiUser.addresses,
	};
}
