import axios, { AxiosResponse } from "axios";
import { isDebug } from "../../config";
import { v4 as uuidv4 } from "uuid";
class HttpServiceCLover {
	static instance = axios.create({
		baseURL: import.meta.env.VITE_APP_baseApiURLClover,
		timeout: 90000,
		headers: {
			"Content-Type": "application/json;charset=utf-8",
			Accept: "application/json",
			"X-Clover-Device-Id": import.meta.env.VITE_APP_deviceID,
			"X-POS-ID": import.meta.env.VITE_APP_clientId,
			"X-Clover-Timeout": 90,
		},
	});
	static isRefreshing = false;
	static refreshMethod: Promise<AxiosResponse<any, any>>;
	static commonParams() {
		return {};
	}
	static getAccessToken() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageAccessTokenKeyClover!);
	}
	static getCodeClover() {
		return localStorage.getItem(import.meta.env.VITE_APP_storageCodeClover!);
	}
	static setCodeClover(data: string) {
		return localStorage.setItem(import.meta.env.VITE_APP_storageCodeClover, data);
	}
	static setToken(token: string) {
		HttpServiceCLover.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
		localStorage.setItem(import.meta.env.VITE_APP_storageAccessTokenKeyClover!, token);
	}
	static initialize() {
		const token = HttpServiceCLover.getAccessToken();
		if (token) {
			HttpServiceCLover.setToken(token);
		}
		HttpServiceCLover.instance.interceptors.request.use((request) => {
			return request;
		});
		// const createToken = () => {
		// 	if (HttpServiceCLover.isRefreshing) {
		// 		return HttpServiceCLover.refreshMethod;
		// 	}
		// 	HttpServiceCLover.isRefreshing = true;
		// 	HttpServiceCLover.refreshMethod = this.doPostRequest(
		// 		"oauth/v2/token",
		// 		{
		// 			client_id: import.meta.env.VITE_APP_clientId!,
		// 			client_secret: import.meta.env.VITE_APP_clientSecret!,
		// 			code: HttpServiceCLover.getCodeClover(),
		// 			grant_type: "authorization_code",
		// 		},
		// 		false
		// 	);
		// 	return HttpServiceCLover.refreshMethod;
		// };
		HttpServiceCLover.instance.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				console.log("Root error.message", error.message);
				switch (error.message) {
					// case "Invalid access token!":
					// case "Request failed with status code 401":
					// 	try {
					// 		localStorage.setItem("wtcIsRefeshingToken", HttpServiceCLover.isRefreshing.toString());
					// 		if (!HttpServiceCLover.isRefreshing && HttpServiceCLover.getRefreshToken() !== null) {
					// 			console.log("Root refresh token");
					// 			const rs = await refreshToken();
					// 			//console.log("Reponse Refresh Token", rs)
					// 			if ([200, 201].includes(rs.status)) {
					// 				//console.log('token refreshToken: ', rs.data.data)
					// 				const { accessToken } = rs.data.data;
					// 				if (HttpServiceCLover.isRefreshing) {
					// 					HttpServiceCLover.setToken(accessToken);
					// 					HttpServiceCLover.isRefreshing = false;
					// 				}
					// 				const config = error.config;
					// 				config.headers["Authorization"] = `Bearer ${accessToken}`;
					// 				return await HttpServiceCLover.instance.request(config);
					// 			} else {
					// 				return Promise.reject(rs);
					// 			}
					// 		} else {
					// 			const response = error.response ? error.response.data : error;
					// 			return Promise.reject(response);
					// 		}
					// 	} catch (error) {
					// 		return Promise.reject(error);
					// 	}
					// case "Invalid refresh token!":
					// 	error.message = "Authentication failed";
					// 	if (HttpServiceCLover.isRefreshing) {
					// 		error.message = "Session expired";
					// 		return Promise.reject(error);
					// 	}

					// 	break;
					default:
						const response = error.response ? error.response.data : error;
						console.log(response);
						return Promise.reject(response);
				}
			}
		);
	}
	static checkAndAddHeaderAuthToken() {
		if (!HttpServiceCLover.instance.defaults.headers["Authorization"]) {
			const token = HttpServiceCLover.getAccessToken();
			if (token) {
				HttpServiceCLover.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
			}
		}
	}
	static async doPostRequest(url: string, data: any, _withAccessToken = true) {
		// if (isDebug) console.log("call post", HttpServiceCLover.getAccessToken(), url, data);
		// if (!withAccessToken) {
		// 	delete HttpServiceCLover.instance.defaults.headers["Authorization"];
		// 	return HttpServiceCLover.instance.post(url, data, {
		// 		//headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
		// 	});
		// } else {
		const headers = {
			"Idempotency-Key": uuidv4(),
		};
		const params = { ...Object(data), ...this.commonParams() };
		this.checkAndAddHeaderAuthToken();
		const response = HttpServiceCLover.instance.post(url, params, { headers });
		return response;
		// }
	}

	static async doGetRequest(url: string, data: any, withAccessToken = true) {
		if (isDebug) console.log("call get", HttpServiceCLover.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpServiceCLover.instance.defaults.headers["Authorization"];
			return HttpServiceCLover.instance.get(url, { params: data });
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			return HttpServiceCLover.instance.get(url, { params: params });
		}
	}

	static async doPatchRequest(url: string, data: any, withAccessToken = true, uploadFile = false, dataarr = false) {
		if (isDebug) console.log("call patch", HttpServiceCLover.getAccessToken(), url, data);
		if (!withAccessToken) {
			delete HttpServiceCLover.instance.defaults.headers["Authorization"];
			return HttpServiceCLover.instance.patch(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			if (uploadFile) {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpServiceCLover.instance.patch(url, params, {
					headers: { "content-type": "multipart/form-data" },
				});
			} else if (dataarr) {
				this.checkAndAddHeaderAuthToken();
				return HttpServiceCLover.instance.patch(url, data);
			} else {
				const params = { ...Object(data), ...this.commonParams() };
				this.checkAndAddHeaderAuthToken();
				return HttpServiceCLover.instance.patch(url, params);
			}
		}
	}

	static async doPutRequest(url: string, data: any, withAccessToken = true) {
		if (!withAccessToken) {
			delete HttpServiceCLover.instance.defaults.headers["Authorization"];
			return HttpServiceCLover.instance.put(url, data, {
				headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
			});
		} else {
			const params = { ...Object(data), ...this.commonParams() };
			this.checkAndAddHeaderAuthToken();
			return HttpServiceCLover.instance.put(url, params);
		}
	}

	static async doDeleteRequest(url: string, data: any) {
		const params = { ...Object(data), ...this.commonParams() };
		return HttpServiceCLover.instance.delete(url, {
			data: params,
			headers: { "x-api-key": import.meta.env.VITE_APP_storageApiKey },
		});
	}
}
export { HttpServiceCLover };
