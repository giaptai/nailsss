import { PaymentDetailResponse } from "../models/category/PaymentRespone.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const PaymentService = {
	async Payment(data: any) {
		const response = await HttpService.doPostRequest("/payment", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async GetListPayment(idOrder: string) {
		const response = await HttpService.doGetRequest("/payment?orderId=" + idOrder, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async paymentTipForEmployee(data: any) {
		const response = await HttpService.doPostRequest("/payment/employee/TIP", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async paymentServiceForEmployee(data: any) {
		const response = await HttpService.doPostRequest("/payment/employee/SERVICE", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async calculateAmountByMethod(data: PaymentDetailResponse[] | undefined): Promise<Record<string, number>> {
		const result: Record<string, number> = {};
		if (data)
			data.forEach((item: PaymentDetailResponse) => {
				const { method, amount, attributes } = item;
				if (result[method]) {
					result[method] += amount;
				} else {
					result[method] = amount;
				}
				if (attributes?.isCreditCardFee) {
					result[method] += attributes.creditCardFeeAmount || 0;
				}
			});

		return result;
	},
};
