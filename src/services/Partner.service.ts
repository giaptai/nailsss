import { PartnerModel } from "../models/category/Partner.model";

import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const PartnerService = {
    partnersFromJson(data: any) {
        const list: PartnerModel[] = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item = new PartnerModel(element._id, element.code, element.firstName, element.lastName, element.middleName, element.phone, element.address, element.email, element.gender, element.status)
            list.push(item)
        }
        return list
    },
    async fetchPartners(data: any) {
        const response = await HttpService.doGetRequest("/partners", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async addPartner(data: any) {
        const response = await HttpService.doPostRequest("/partners", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updatePartner(data: any) {
        const response = await HttpService.doPatchRequest("/partners/" + data._id, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async deletePartner(_id: string) {
        const response = await HttpService.doPatchRequest("/partners/" + _id + "/soft-delete", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async restorePartner(_id: string) {
        const response = await HttpService.doPatchRequest("/partners/" + _id + "/restore", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
}