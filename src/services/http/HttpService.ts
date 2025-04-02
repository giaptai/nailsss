import axios, { AxiosResponse } from "axios";
import { isDebug } from "../../config";

class HttpService {
	static instance = axios.create({
		baseURL: import.meta.env.VITE_APP_baseApiURL,
		timeout: 90000,
		headers: {
			"Content-Type": "application/json;charset=utf-8",
			Accept: "application/json",
			"x-db-name": localStorage.getItem(import.meta.env.VITE_APP_dbNameKey!),
			// header x-db-name:''
		},
	});
	static isRefreshing = false;
	static refreshMethod: Promise<AxiosResponse<any, any>>;
	static commonParams() {
		return {};
	}
	static getDbName() {
		return localStorage.getItem(import.meta.env.VITE_APP_dbNameKey!);
	}
	static getLocalDeviceId() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageDeviceIdKey!);
	}
	static getAccessToken() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageAccessTokenKey!);
	}
	static getRefreshToken() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageRefreshTokenKey!);
	}
	static getUsername() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageUsernameKey!);
	}
	static setToken(token: string) {
		HttpService.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
		localStorage.setItem(import.meta.env.VITE_APP_storageAccessTokenKey!, token);
	}
	static setRefreshToken(token: string) {
		localStorage.setItem(import.meta.env.VITE_APP_storageRefreshTokenKey!, token);
	}
	static initialize() {
		const token = HttpService.getAccessToken();
		if (token) {
			HttpService.setToken(token);
		}
		HttpService.instance.interceptors.request.use((request) => {
			return request;
		});
		const refreshToken = () => {
			const refreshToken = HttpService.getRefreshToken();
			const dbName = HttpService.getDbName();
			const refreshState = HttpService.isRefreshing;
			console.log("HttpService.isRefreshing", HttpService.isRefreshing);
			if (refreshState) {
				return HttpService.refreshMethod;
			}
			HttpService.isRefreshing = true;
			HttpService.refreshMethod = this.doPostRequest(
				"auth/tokens/refresh",
				{ refreshToken: refreshToken, dbName: dbName },
				false
			);
			return HttpService.refreshMethod;
		};
		HttpService.instance.interceptors.response.use(
			(response) => {
				HttpService.isRefreshing = false;
				return response;
			},
			async (error) => {
				//console.log("error.response", error.response);
				const { status, data } = error.response;
				if (status === 401 && data.message === "Invalid access token!") {
					try {
						//console.log("call Client Refresh");
						const rs = await refreshToken();
						if ([200, 201].includes(rs.status)) {
							console.log("Client token refreshedToken: ", rs.data.data);
							const { accessToken } = rs.data.data;
							//if (HttpService.isRefreshing) {
							HttpService.setToken(accessToken);
							//HttpService.isRefreshing = false;
							//}
							const config = error.config;
							config.headers["Authorization"] = `Bearer ${accessToken}`;
							return await HttpService.instance.request(config);
						} else {
							return Promise.reject(rs);
						}
					} catch (error) {
						return Promise.reject(error);
					}
				} else {
					//const response = error.response ? error.response.data : error
					return Promise.reject(error);
				}
			}
		);
	}
	static checkAndAddHeaderAuthToken() {
		if (!HttpService.instance.defaults.headers["Authorization"]) {
			const token = HttpService.getAccessToken();
			if (token) {
				HttpService.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
			}
		}
	}
	static async doPostRequest(url: string, data: any, withAccessToken = true) {
		if (isDebug) console.log("call post", HttpService.getAccessToken(), url, data);
		if (!withAccessToken) {
			console.log("Client call post with no access token", url, data);
			delete HttpService.instance.defaults.headers["Authorization"];
			return HttpService.instance.post(url, data);
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			const response = HttpService.instance.post(url, params);
			return response;
		}
	}

	static async doGetRequest(url: string, data: any, withAccessToken = true, requireDbName = true) {
		if (isDebug) console.log("call get", HttpService.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpService.instance.defaults.headers["Authorization"];
			return HttpService.instance.get(url, { params: data });
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			const headers: any = {};
			if (requireDbName) {
				headers["x-db-name"] = this.getDbName();
			}
			return HttpService.instance.get(url, { params, headers });
		}
	}

	static async doPatchRequest(url: string, data: any, withAccessToken = true, uploadFile = false, dataarr = false) {
		if (isDebug) console.log("call patch", HttpService.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpService.instance.defaults.headers["Authorization"];
			return HttpService.instance.patch(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			if (uploadFile) {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpService.instance.patch(url, params, { headers: { "content-type": "multipart/form-data" } });
			} else if (dataarr) {
				this.checkAndAddHeaderAuthToken();
				return HttpService.instance.patch(url, data);
			} else {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpService.instance.patch(url, params);
			}
		}
	}

	static async doPutRequest(url: string, data: any, withAccessToken = true) {
		if (!withAccessToken) {
			delete HttpService.instance.defaults.headers["Authorization"];
			return HttpService.instance.put(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			return HttpService.instance.put(url, params);
		}
	}

	static async doDeleteRequest(url: string, data: any) {
		const params = { ...Object(data), ...this.commonParams() };
		return HttpService.instance.delete(url, {
			data: params,
			headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
		});
	}
	static async fetchAvatarStreamFromServer(url: string) {
		const response = await fetch(`${import.meta.env.VITE_APP_baseApiURL}${url}`, {
			headers: {
				Authorization: `Bearer ${HttpService.getAccessToken()}`,
			},
		});
		if (!response.ok) {
			throw new Error("Failed to fetch avatar stream");
		}
		const blob = await response.blob();
		const imageUrl = URL.createObjectURL(blob);
		return imageUrl;
	}
}
export { HttpService };
