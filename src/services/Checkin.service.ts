import { ListServiceSelectedModel } from "../models/category/ListServiceSelected.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const CheckinService = {
	async removeServiceById(dataArray: ListServiceSelectedModel[], dataId: string, serviceId: string) {
		return dataArray.map((dataItem) => {
			if (dataItem._id === dataId) {
				return {
					...dataItem,
					ListService:
						dataItem.ListService && dataItem.ListService.filter((service) => service._id !== serviceId),
				};
			}
			return dataItem;
		});
	},
	async CheckIn(data: any) {
		const response = await HttpService.doPostRequest("check-in", data);
		const res = parseCommonHttpResult(response);
		return res;
	},
};
