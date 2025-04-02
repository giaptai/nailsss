import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const StatementService = {
	async fetchStatement(data: any) {
		const response = await HttpService.doGetRequest(
			"/reports/COST?mode=DATE&from=" + data.fromDate + "&to=" + data.toDate,
			{}
		);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async reloadReport(data: any) {
		const response = await HttpService.doPostRequest("/reports/reload", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async getReportRevenue(data: any) {
		const methodsQuery = data.methods
			.map((method: any) => `methods[]=${encodeURIComponent(method.value)}`)
			.join("&");

		const url =
			`/orders/paid-orders?from=${encodeURIComponent(data.fromDate)}` +
			`&to=${encodeURIComponent(data.toDate)}` +
			(methodsQuery ? `&${methodsQuery}` : "");
		const response = await HttpService.doGetRequest(url, {});

		const res = parseCommonHttpResult(response);
		return res;
	},
};
