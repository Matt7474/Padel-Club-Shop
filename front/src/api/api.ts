import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_URL,
	headers: { "Content-Type": "application/json" },
});

let isRedirecting = false;

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 403)
		) {
			const { logout } = useAuthStore.getState();

			// Évite de rediriger plusieurs fois
			if (!isRedirecting) {
				isRedirecting = true;
				logout();
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	},
);

export default api;
