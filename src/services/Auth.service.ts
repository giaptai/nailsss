import { HttpService } from "./http/HttpService";
import { HttpServiceRoot } from "./http/HttpServiceRoot";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const AuthService = {
	async login(data: any) {
		const response = await HttpService.doPostRequest("auth/login", data, false);
		return parseCommonHttpResult(response);
	},
	async changePassword(data: any) {
		const response = await HttpService.doPatchRequest("auth/change-password", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async getDbName(data: any) {
		const response = await HttpServiceRoot.doGetRequest(`stores/info/${data?.storeCode}`, data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async activeAccount(data: any) {
		const response = await HttpService.doPatchRequest("auth/reset-password", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
};
