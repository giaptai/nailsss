import { CustomerModel } from "../models/category/Customer.model";
import { StoreModel } from "../models/category/Store.model";

import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const StoreService = {
    storesFromJson(data: any) {
        const list: StoreModel[] = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item = new StoreModel(element?._id, element?.code, element?.name, element?.status, element?.street1, element?.street2,
                element?.city, element?.state, element?.zipcode, element?.phone, element?.email, element?.config, CustomerModel.fromJson(element?.customer))
            list.push(item)
        }
        return list
    },
    async fetchStores() {
        const response = await HttpService.doGetRequest("/stores", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async fetchStoreInCustomers(_id:string) {
        const response = await HttpService.doGetRequest("/customers/" + _id + "/stores", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async addStore(data: any) {
        const response = await HttpService.doPostRequest("/stores", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updateStore(data: any) {
        const response = await HttpService.doPatchRequest("/stores/" + data._id, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async deleteStore(_id: string) {
        const response = await HttpService.doPatchRequest("/stores/" + _id + "/soft-delete", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async restoreStore(_id: string) {
        const response = await HttpService.doPatchRequest("/stores/" + _id + "/restore", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
}