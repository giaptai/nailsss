
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const StoreConfigService = {
    StoreConfigFromJson(data: any) {
        const list: any[] = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item = {
                id: element._id,
                key: element.key,
                value: element.value,
                type: element.type
            }
            list.push(item)
        }
        return list
    },
    async updateStoreConfig(data: any) {
        const response = await HttpService.doPatchRequest("/configs", data,true,false,true);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async getStoreConfig() {
        const response = await HttpService.doGetRequest("/configs",{});
        const res = parseCommonHttpResult(response)
        return res;
    },
    
}