import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const AbilityService = {
    async addAbility(data: any) {
        const response = await HttpService.doPostRequest("/abilities", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updateAbility(data: any) {
        const response = await HttpService.doPatchRequest("/abilities/" + data._id, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async deleteAbility(_id: string) {
        const response = await HttpService.doDeleteRequest("/abilities/" + _id, {});
        const res = parseCommonHttpResult(response)
        return res;
    },
}