import { ServiceModel } from "../models/category/Service.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const ServiceService = {
	ServiceFromJson(data: any) {
		const list: ServiceModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			if (element?.status?.code == "ACTIVE") {
				const item = new ServiceModel(
					element?._id,
					element?.displayName,
					element?.name,
					element?.storePrice,
					element?.employeePrice,
					element?.tax == true ? "YES" : "NO",
					element?.menu,
					element?.menu._id,
					element?.askForPrice == true ? "YES" : "NO",
					element?.note,
					element?.type,
					element?.turn.toString(),
					element?.sortOrder,
					element?.status,
					1,
					element.position,
					element.employeeSelect,
					"",
					1 * element.storePrice,
					1 * element.employeePrice,
					element.color,
					element?.isShowCheckin
				);
				list.push(item);
			}
		}
		return list;
	},
	async fetchService() {
		const response = await HttpService.doGetRequest("/services", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async addService(data: ServiceModel) {
		const response = await HttpService.doPostRequest("/services", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateService(data: any) {
		const response = await HttpService.doPatchRequest("/services/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteService(id: string) {
		const response = await HttpService.doPatchRequest("/services/" + id + "/soft-delete", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async restoreService(id: string) {
		const response = await HttpService.doPatchRequest("/services/" + id + "/restore", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
};
