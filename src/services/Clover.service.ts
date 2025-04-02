import { HttpService } from "./http/HttpService";
import { HttpServiceCLover } from "./http/HttpServiceCLover";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const CloverService = {
	async createCode(): Promise<any> {
		try {
			const { code, message } = await handleLoginv2();
			if (!code) {
				throw new Error(message);
			}

			const res = await CloverService.createTokenClover(code);
			if (res.code === 201) {
				return { data: res.data?.data, message: "Token created successfully." };
			} else {
				throw new Error("Failed to create token.");
			}
		} catch (error: any) {
			throw new Error(error.message || "An error occurred during authentication.");
		}
	},
	async createTokenClover(code: string) {
		const data = {
			code: code,
			clientId: import.meta.env.VITE_APP_clientId,
			clientSecret: import.meta.env.VITE_APP_clientSecret,
		};
		const response = await HttpService.doPostRequest("/clover/token", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async refreshTokenClover(refresh_token: string) {
		const data = {
			clientId: import.meta.env.VITE_APP_clientId,
			refresh_token: refresh_token,
		};
		const response = await HttpService.doPostRequest("/clover/refresh", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async displayOrderClover(data: any) {
		const response = await HttpServiceCLover.doPostRequest("device/display-order", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async paymentClover(data: any) {
		const response = await HttpServiceCLover.doPostRequest("payments", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async showThankClover() {
		const response = await HttpServiceCLover.doPostRequest("device/thank-you", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
};
// const requestAPIToken = async () => {
// 	const URL = `${import.meta.env.VITE_APP_baseApiURLClover}oauth/v2/token`;

// 	const response = await axiosClient
// 		.post(URL, {
// 			client_id: "358QJT1644ET4",
// 			client_secret: "341c51e5-3124-d15b-65b7-7d7d3dfd1869",
// 			code: HttpServiceCLover.getCodeClover(),
// 			grant_type: "authorization_code",
// 		})
// 		.catch((err) => console.log(err.message));
// 	console.log("🚀 ~ requestAPIToken ~ response:", response);
// };
// const handleLoginv2 = async () => {
// 	const popup = window.open(
// 		"https://apisandbox.dev.clover.com/oauth/v2/authorize?client_id=358QJT1644ET4&redirect_uri=http://localhost:5173",
// 		"Clover Auth",
// 		"width=600,height=600"
// 	);
// 	const timer = setInterval(async () => {
// 		if (popup && popup.closed) {
// 			clearInterval(timer);
// 			console.log("Popup đã đóng.");
// 		}

// 		try {
// 			// Kiểm tra nếu popup trả về dữ liệu
// 			if (popup && popup.location.origin === window.location.origin) {
// 				const params = new URLSearchParams(popup.location.search);
// 				const code = params.get("code");
// 				console.log("Code:", code);
// 				localStorage.setItem(import.meta.env.VITE_APP_storageCodeClover, code || "");
// 				popup.close();
// 				// CloverService.CreateTokenClover();
// 				if (HttpServiceCLover.getCodeClover() != null) {
// 					const res = await CloverService.createTokenClover(HttpServiceCLover.getCodeClover() || "");
// 					if ((res.code = 201)) {
// 						const data = res.data?.data;
// 					}
// 				}
// 				clearInterval(timer);
// 				return code;
// 			}
// 		} catch (error) {
// 			return "";
// 			// console.log(error.message);
// 		}
// 	}, 500);
// };
const handleLoginv2 = async (): Promise<{ code: string | null; message: string }> => {
	return new Promise((resolve, reject) => {
		const popup = window.open(
			`https://apisandbox.dev.clover.com/oauth/v2/authorize?client_id=${
				import.meta.env.VITE_APP_clientId
			}&redirect_uri=${import.meta.env.VITE_APP_redirectURL}`,
			"Clover Auth",
			"width=600,height=600"
		);

		if (!popup) {
			reject({ code: null, message: "AUTHENTICATE_FAILED" });
			return;
		}

		const timer = setInterval(async () => {
			if (popup.closed) {
				clearInterval(timer);

				reject({ code: null, message: "AUTHENTICATE_FAILED" });
				return;
			}

			try {
				if (popup.location.origin === window.location.origin) {
					const params = new URLSearchParams(popup.location.search);
					const code = params.get("code");

					if (code) {
						localStorage.setItem(import.meta.env.VITE_APP_storageCodeClover, code);
						popup.close();
						clearInterval(timer);

						resolve({ code, message: "Authorization successful." });
					} else {
						popup.close();
						reject({ code: null, message: "Authorization code not found." });
					}
				}
			} catch (error) {
				// reject({ code: null, message: error });
				// Cross-origin error until popup redirects to the same origin
			}
		}, 500);
	});
};
