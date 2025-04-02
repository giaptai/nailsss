
import { GiftcardModel } from "../models/category/Giftcard.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const GiftcardService = {
	GiftcardFromJson(data: any) {
		const list: GiftcardModel[] = []
		for (let index = 0; index < data.length; index++) {
			const element = data[index]
			const item = new GiftcardModel(element?._id, element?.cardId, element?.amount, element?.firstName, element?.lastName, element?.phone, element?.zipcode, element?.note, element?.type, element?.status, element?.remaining, undefined)
			list.push(item)
		}
		return list
	},
	async fetchGiftcard() {
		const response = await HttpService.doGetRequest("/gift-cards", {});
		const res = parseCommonHttpResult(response)
		return res;
	},
	async addGiftcard(data: GiftcardModel) {
		const response = await HttpService.doPostRequest("/gift-cards", data);
		const res = parseCommonHttpResult(response)
		return res;
	},
	async updateGiftcard(data: any) {
		const response = await HttpService.doPatchRequest("/gift-cards/" + data._id, data.data);
		const res = parseCommonHttpResult(response)
		return res;
	},
	async fetchDetailGiftcard(id: string) {
		const response = await HttpService.doGetRequest("/gift-cards/" + id, {});
		const res = parseCommonHttpResult(response)
		return res;
	},
	async deleteGiftcard(id: any) {
		const response = await HttpService.doPatchRequest("/gift-cards/" + id + "/soft-delete", {});
		const res = parseCommonHttpResult(response)
		return res;
	},
	async restoreGiftcard(id: string) {
		const response = await HttpService.doPatchRequest("/gift-cards/" + id + "/restore", {});
		const res = parseCommonHttpResult(response)
		return res;
	},

}