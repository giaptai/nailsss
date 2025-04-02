import { LanguageModel } from "../models/category/Language.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const LanguageService = {
    LanguagesFromJson(data: any) {
        const list: LanguageModel[] = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item = new LanguageModel(element?.code, element?.value)
            list.push(item)
        }
        return list
    },
    async fetchLanguages(lang: string) {
        const response = await HttpService.doGetRequest("/langs/" + lang, {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updateSentence(data: any) {
        const response = await HttpService.doPatchRequest("/langs/" + data.lang, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async createSentence(data: any) {
        const response = await HttpService.doPostRequest("/langs/" + data.lang, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
}