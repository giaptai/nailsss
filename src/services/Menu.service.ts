
import { MenuModel } from "../models/category/Menu.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
export const MenusService = {
    MenusFromJson(data: any) {
        const list: MenuModel[] = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item = new MenuModel(element?._id,element?.name,element?.code,element.color,element?.status)
            list.push(item)
        }
        return list
    },
    async fetchMenus() {
        const response = await HttpService.doGetRequest("/Menus", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async addMenus(data:MenuModel) {
        const response = await HttpService.doPostRequest("/Menus", data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async updateMenus(data: any) {
        const response = await HttpService.doPatchRequest("/Menus/" + data._id, data.data);
        const res = parseCommonHttpResult(response)
        return res;
    },
    async deleteMenus(id: any) {
        const response = await HttpService.doPatchRequest("/menus/" + id+"/soft-delete",{});
        const res = parseCommonHttpResult(response)
        return res;
    },
    async restoreMenus(id: string) {
        const response = await HttpService.doPatchRequest("/menus/" + id + "/restore", {});
        const res = parseCommonHttpResult(response)
        return res;
    },
    
}