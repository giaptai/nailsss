import { PermissionModel } from "../models/category/Permission.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const MasterdataService = {
	permisionsFromJson(data: any) {
		const list: PermissionModel[] = [];
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			const item = new PermissionModel(
				element._id,
				element.code,
				element.name,
				element.action,
				element.fields ?? []
			);
			list.push(item);
		}
		return list;
	},
	async fetchPermissions(dbName: string) {
		const response = await HttpService.doGetRequest("master-data/permissions/" + dbName, {});
		const res = parseCommonHttpResult(response);
		return res;
	},
	async fetchStatus() {
		const response = await HttpService.doGetRequest("master-data/status", {});
		const res = parseCommonHttpResult(response);
		return res;
	},
};
