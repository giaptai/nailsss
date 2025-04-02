import axios from "axios";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_APP_baseApiURLClover,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		vary: "Origin,Access-Control-Request-Method,Access-Control-Request-Headers",
	},
});

axiosClient.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem("jwt");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
axiosClient.interceptors.response.use(
	async (res) => res,
	async (error) => {
		try {
			console.error(`Error! Status Code: ` + error);
			return Promise.reject(error);
		} catch (error) {
			console.error("Error while showing confirmation:", error);
		}
	}
);

export default axiosClient;
