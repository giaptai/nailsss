import { CustomerModel } from "../models/category/Customer.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const CustomerService = {
	customersFromJson(data: any) {
		const list: CustomerModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const item = new CustomerModel(
				element._id,
				element.code,
				element.firstName,
				element?.lastName,
				element?.phone,
				element?.email,
				element?.gender,
				element?.status,
				element?.address,
				element?.city,
				element?.state,
				element?.zipcode,
				element?.birthday,
				element?.note
			);
			list.push(item);
		}
		return list;
	},
	async fetchCustomers(data: any) {
		const response = await HttpService.doGetRequest("/customers", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async addCustomer(data: any) {
		const response = await HttpService.doPostRequest("/customers", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateCustomer(data: any) {
		const response = await HttpService.doPatchRequest("/customers/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteCustomer(_id: string) {
		const response = await HttpService.doPatchRequest("/customers/" + _id + "/soft-delete", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async restoreCustomer(_id: string) {
		const response = await HttpService.doPatchRequest("/customers/" + _id + "/restore", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async getHistoryCustomer(id: string) {
		const response = await HttpService.doGetRequest(
			"/orders/paid-customers?from=2023-11-11&to=2030-11-28&page=1&limit=9999&customerId=" + id,
			{}
		);
		const res = parseCommonHttpResult(response);
		return res;
	},
};
