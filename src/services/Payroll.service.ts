import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const PayrollService = {
	async fetchPayroll(data: any) {
		// if (data) await HttpService.doPostRequest("/reports/reload", data);
		if (data.status) {
			const response = await HttpService.doGetRequest(
				"/reports/PAYROLL?mode=DATE&from=" + data.fromDate + "&to=" + data.toDate + "&status=" + data.status,
				{}
			);
			const res = parseCommonHttpResult(response);
			return res;
		} else {
			const response = await HttpService.doGetRequest(
				"/reports/PAYROLL?mode=DATE&from=" + data.fromDate + "&to=" + data.toDate,
				{}
			);
			const res = parseCommonHttpResult(response);
			return res;
		}
	},
};
