import axios, { AxiosResponse } from "axios";
import { isDebug } from "../../config";

class HttpServiceRoot {
	static instance = axios.create({
		baseURL: import.meta.env.VITE_APP_baseApiURLRoot,
		timeout: 90000,
		headers: {
			"Content-Type": "application/json;charset=utf-8",
			Accept: "application/json",
		},
	});
	static isRefreshing = false;
	static refreshMethod: Promise<AxiosResponse<any, any>>;
	static commonParams() {
		return {};
	}
	static getLocalDeviceId() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageDeviceIdKeyRoot!);
	}
	static getAccessToken() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageAccessTokenKeyRoot!);
	}
	static getRefreshToken() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageRefreshTokenKeyRoot!);
	}
	static getDbName() {
		return localStorage.getItem(import.meta.env.VITE_APP_dbNameKey!);
	}
	static getUsername() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageUsernameKeyRoot!);
	}
	static setToken(token: string) {
		HttpServiceRoot.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
		localStorage.setItem(import.meta.env.VITE_APP_storageAccessTokenKeyRoot!, token);
	}
	static setRefreshToken(token: string) {
		localStorage.setItem(import.meta.env.VITE_APP_storageRefreshTokenKeyRoot!, token);
	}
	static initialize() {
		const token = HttpServiceRoot.getAccessToken();
		if (token) {
			HttpServiceRoot.setToken(token);
		}
		HttpServiceRoot.instance.interceptors.request.use((request) => {
			return request;
		});
		const refreshToken = () => {
			if (HttpServiceRoot.isRefreshing) {
				return HttpServiceRoot.refreshMethod;
			}
			HttpServiceRoot.isRefreshing = true;
			HttpServiceRoot.refreshMethod = this.doPostRequest(
				"auth/tokens/refresh",
				{ refreshToken: HttpServiceRoot.getRefreshToken(), dbName: HttpServiceRoot.getDbName() },
				false
			);
			return HttpServiceRoot.refreshMethod;
		};
		HttpServiceRoot.instance.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				console.log("Root error.message", error.message);
				switch (error.message) {
					case "Invalid access token!":
					case "Request failed with status code 401":
						try {
							localStorage.setItem("wtcIsRefeshingToken", HttpServiceRoot.isRefreshing.toString());
							if (!HttpServiceRoot.isRefreshing && HttpServiceRoot.getRefreshToken() !== null) {
								console.log("Root refresh token");
								const rs = await refreshToken();
								//console.log("Reponse Refresh Token", rs)
								if ([200, 201].includes(rs.status)) {
									//console.log('token refreshToken: ', rs.data.data)
									const { accessToken } = rs.data.data;
									if (HttpServiceRoot.isRefreshing) {
										HttpServiceRoot.setToken(accessToken);
										HttpServiceRoot.isRefreshing = false;
									}
									const config = error.config;
									config.headers["Authorization"] = `Bearer ${accessToken}`;
									return await HttpServiceRoot.instance.request(config);
								} else {
									return Promise.reject(rs);
								}
							} else {
								const response = error.response ? error.response.data : error;
								return Promise.reject(response);
							}
						} catch (error) {
							return Promise.reject(error);
						}
					case "Invalid refresh token!":
						error.message = "Authentication failed";
						if (HttpServiceRoot.isRefreshing) {
							error.message = "Session expired";
							return Promise.reject(error);
						}

						break;
					default:
						const response = error.response ? error.response.data : error;
						console.log(response);
						return Promise.reject(response);
				}
			}
		);
	}
	static checkAndAddHeaderAuthToken() {
		if (!HttpServiceRoot.instance.defaults.headers["Authorization"]) {
			const token = HttpServiceRoot.getAccessToken();
			if (token) {
				HttpServiceRoot.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
			}
		}
	}
	static async doPostRequest(url: string, data: any, withAccessToken = true) {
		if (isDebug) console.log("call post", HttpServiceRoot.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpServiceRoot.instance.defaults.headers["Authorization"];
			return HttpServiceRoot.instance.post(url, data, {
				//headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			const response = HttpServiceRoot.instance.post(url, params);
			return response;
		}
	}

	static async doGetRequest(url: string, data: any, withAccessToken = true) {
		if (isDebug) console.log("call get", HttpServiceRoot.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpServiceRoot.instance.defaults.headers["Authorization"];
			return HttpServiceRoot.instance.get(url, { params: data });
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			return HttpServiceRoot.instance.get(url, { params: params });
		}
	}

	static async doPatchRequest(url: string, data: any, withAccessToken = true, uploadFile = false, dataarr = false) {
		if (isDebug) console.log("call patch", HttpServiceRoot.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpServiceRoot.instance.defaults.headers["Authorization"];
			return HttpServiceRoot.instance.patch(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			if (uploadFile) {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpServiceRoot.instance.patch(url, params, {
					headers: { "content-type": "multipart/form-data" },
				});
			} else if (dataarr) {
				this.checkAndAddHeaderAuthToken();
				return HttpServiceRoot.instance.patch(url, data);
			} else {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpServiceRoot.instance.patch(url, params);
			}
		}
	}

	static async doPutRequest(url: string, data: any, withAccessToken = true) {
		if (!withAccessToken) {
			delete HttpServiceRoot.instance.defaults.headers["Authorization"];
			return HttpServiceRoot.instance.put(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			return HttpServiceRoot.instance.put(url, params);
		}
	}

	static async doDeleteRequest(url: string, data: any) {
		const params = { ...Object(data), ...this.commonParams() };
		return HttpServiceRoot.instance.delete(url, {
			data: params,
			headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
		});
	}
}
export { HttpServiceRoot };
