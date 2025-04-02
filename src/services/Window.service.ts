import { WindowModel } from "../models/category/Window.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const WindowService = {
	windowFromJson(data: any) {
		const list: WindowModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const item = new WindowModel(element?._id, element?.name, element?.code, element?.type, element?.status);
			list.push(item);
		}
		return list;
	},
	async fetchWindow() {
		const response = await HttpService.doGetRequest("/windows", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async addWindow(data: WindowModel) {
		const response = await HttpService.doPostRequest("/windows", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async updateWindow(data: any) {
		const response = await HttpService.doPatchRequest("/windows/" + data._id, data.data);
		const res = parseCommonHttpResult(response);
		return res;
	},
	async deleteWindow(id: any) {
		const response = await HttpService.doDeleteRequest("/windows/" + id, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async restoreWindwos(id: string) {
		const response = await HttpService.doPatchRequest("/windows/" + id + "/restore", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
};
